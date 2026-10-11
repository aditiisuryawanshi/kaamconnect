from datetime import datetime, timezone
import random
import string
from bson import ObjectId
from app.extensions import mongo
from app.common.errors import NotFoundError, ForbiddenError, BadRequestError, ConflictError
from app.common.validators import parse_object_id
from app.services.notification_service import NotificationService

class BookingService:
    @staticmethod
    def _generate_booking_reference() -> str:
        date_str = datetime.now(timezone.utc).strftime("%Y%m%d")
        rand_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
        return f"KC-BKG-{date_str}-{rand_str}"

    @staticmethod
    def create_booking(customer_user_id: str, data: dict) -> dict:
        cid = parse_object_id(customer_user_id)
        listing_id = parse_object_id(data.get("service_listing_id"))
        
        listing = mongo.db.service_listings.find_one({"_id": listing_id})
        if not listing:
            raise NotFoundError("Service listing not found")
        if listing.get("status") != "published" or listing.get("moderation_status") != "approved":
            raise BadRequestError("This service is currently not available for bookings")

        worker_id = listing["worker_id"]
        if worker_id == cid:
            raise BadRequestError("You cannot book your own service listing")

        scheduled_date = data["scheduled_date"]
        time_slot = data["scheduled_time_slot"]

        # Concurrency & conflict check: Is this worker already confirmed for this date and time slot?
        conflict = mongo.db.bookings.find_one({
            "worker_id": worker_id,
            "scheduled_date": scheduled_date,
            "scheduled_time_slot": time_slot,
            "status": {"$in": ["confirmed", "in_progress"]}
        })
        if conflict:
            raise ConflictError("The provider is already booked for this date and time slot. Please choose another time.")

        loc_id = parse_object_id(data["service_locality_id"])
        locality = mongo.db.localities.find_one({"_id": loc_id})
        if not locality:
            raise BadRequestError("Invalid locality selected")

        now = datetime.now(timezone.utc)
        reference = BookingService._generate_booking_reference()

        # Pricing calculation snapshot
        base_rate = listing["pricing"]["amount"]
        unit = listing["pricing"]["unit"]
        estimated_hours = data.get("estimated_hours", 1.0)
        total_estimate = base_rate * (estimated_hours if unit == "hour" else 1.0)

        booking_doc = {
            "booking_reference": reference,
            "customer_id": cid,
            "worker_id": worker_id,
            "service_listing_id": listing_id,
            "service_title_snapshot": listing["title"],
            "service_category_id_snapshot": listing["category_id"],
            "pricing_snapshot": {
                "base_amount": base_rate,
                "currency": listing["pricing"].get("currency", "INR"),
                "unit": unit,
                "estimated_hours": estimated_hours,
                "estimated_total": total_estimate
            },
            "scheduled_date": scheduled_date,
            "scheduled_time_slot": time_slot,
            "service_locality_id": loc_id,
            "service_address_private": data["service_address"].strip(),
            "customer_instructions": (data.get("customer_instructions") or "").strip(),
            "status": "requested",
            "status_history": [
                {
                    "status": "requested",
                    "timestamp": now,
                    "actor_id": cid,
                    "notes": "Booking request submitted by customer"
                }
            ],
            "cancellation_reason": None,
            "created_at": now,
            "updated_at": now
        }

        res = mongo.db.bookings.insert_one(booking_doc)
        booking_id = res.inserted_id

        # Notify worker of new booking request
        NotificationService.notify(
            recipient_user_id=str(worker_id),
            event_type="booking_requested",
            title="New Service Booking Request",
            message=f"You received a booking request for '{listing['title']}' on {scheduled_date} ({time_slot}).",
            resource_type="booking",
            resource_id=str(booking_id)
        )

        return BookingService.get_booking_details(str(booking_id), customer_user_id)

    @staticmethod
    def get_booking_details(booking_id: str, current_user_id: str) -> dict:
        bid = parse_object_id(booking_id)
        uid = parse_object_id(current_user_id)

        booking = mongo.db.bookings.find_one({"_id": bid})
        if not booking:
            raise NotFoundError("Booking not found")

        # Check authorization: user must be customer, assigned worker, or admin
        user = mongo.db.users.find_one({"_id": uid})
        is_admin = "admin" in (user.get("roles") if user else [])
        if booking["customer_id"] != uid and booking["worker_id"] != uid and not is_admin:
            raise ForbiddenError("You are not authorized to view this booking")

        # Enrich worker details
        worker_user = mongo.db.users.find_one({"_id": booking["worker_id"]})
        worker_prof = mongo.db.worker_profiles.find_one({"user_id": booking["worker_id"]})
        booking["worker_name"] = worker_user.get("name") if worker_user else "Provider"
        booking["worker_phone"] = worker_user.get("phone") if (booking["status"] in ["confirmed", "in_progress", "completed"]) else None
        booking["worker_photo_url"] = worker_prof.get("profile_photo_url") if worker_prof else None
        booking["worker_headline"] = worker_prof.get("headline") if worker_prof else ""

        # Enrich customer details
        cust_user = mongo.db.users.find_one({"_id": booking["customer_id"]})
        booking["customer_name"] = cust_user.get("name") if cust_user else "Customer"
        # Customer phone is only visible to the worker once confirmed
        if booking["worker_id"] == uid and booking["status"] in ["confirmed", "in_progress"]:
            booking["customer_phone"] = cust_user.get("phone")
        else:
            booking["customer_phone"] = None

        # Locality name
        loc = mongo.db.localities.find_one({"_id": booking["service_locality_id"]})
        booking["locality_name"] = loc.get("name") if loc else ""

        return booking

    @staticmethod
    def transition_status(booking_id: str, actor_id: str, target_status: str, notes=None, reason=None) -> dict:
        bid = parse_object_id(booking_id)
        aid = parse_object_id(actor_id)

        booking = mongo.db.bookings.find_one({"_id": bid})
        if not booking:
            raise NotFoundError("Booking not found")

        current_status = booking["status"]
        user = mongo.db.users.find_one({"_id": aid})
        is_admin = "admin" in (user.get("roles") if user else [])
        is_worker = (booking["worker_id"] == aid)
        is_customer = (booking["customer_id"] == aid)

        if not (is_worker or is_customer or is_admin):
            raise ForbiddenError("You do not have permission to update this booking")

        now = datetime.now(timezone.utc)

        # Validate allowed transitions
        if target_status == "confirmed":
            if not (is_worker or is_admin):
                raise ForbiddenError("Only the service provider can confirm a booking request")
            if current_status != "requested":
                raise BadRequestError(f"Cannot confirm booking in '{current_status}' status")

            # Double-check slot concurrency before confirming
            conflict = mongo.db.bookings.find_one({
                "_id": {"$ne": bid},
                "worker_id": booking["worker_id"],
                "scheduled_date": booking["scheduled_date"],
                "scheduled_time_slot": booking["scheduled_time_slot"],
                "status": {"$in": ["confirmed", "in_progress"]}
            })
            if conflict:
                raise ConflictError("You already have another confirmed booking for this exact date and time slot.")

        elif target_status == "declined":
            if not (is_worker or is_admin):
                raise ForbiddenError("Only the service provider can decline a booking request")
            if current_status != "requested":
                raise BadRequestError(f"Cannot decline booking in '{current_status}' status")

        elif target_status == "in_progress":
            if not (is_worker or is_admin):
                raise ForbiddenError("Only the service provider can start this booking")
            if current_status != "confirmed":
                raise BadRequestError(f"Cannot start booking in '{current_status}' status")

        elif target_status == "completed":
            if not (is_worker or is_admin):
                raise ForbiddenError("Only the service provider can mark this booking completed")
            if current_status not in ["in_progress", "confirmed"]:
                raise BadRequestError(f"Cannot complete booking in '{current_status}' status")

        elif target_status == "cancelled":
            if current_status not in ["requested", "confirmed"]:
                raise BadRequestError(f"Cannot cancel booking in '{current_status}' status")
        else:
            raise BadRequestError(f"Unknown target status '{target_status}'")

        update_query = {
            "$set": {
                "status": target_status,
                "updated_at": now
            },
            "$push": {
                "status_history": {
                    "status": target_status,
                    "timestamp": now,
                    "actor_id": aid,
                    "notes": notes or f"Status transitioned to {target_status}"
                }
            }
        }
        if reason:
            update_query["$set"]["cancellation_reason"] = reason

        mongo.db.bookings.update_one({"_id": bid}, update_query)

        # Send notifications
        target_notify_uid = str(booking["customer_id"]) if is_worker else str(booking["worker_id"])
        NotificationService.notify(
            recipient_user_id=target_notify_uid,
            event_type=f"booking_{target_status}",
            title=f"Booking {target_status.replace('_', ' ').capitalize()}",
            message=f"Booking #{booking['booking_reference']} has been marked as {target_status}.",
            resource_type="booking",
            resource_id=str(bid)
        )

        return BookingService.get_booking_details(str(bid), actor_id)

    @staticmethod
    def list_customer_bookings(customer_user_id: str, status=None, page=1, limit=20):
        cid = parse_object_id(customer_user_id)
        query = {"customer_id": cid}
        if status:
            query["status"] = status

        total = mongo.db.bookings.count_documents(query)
        cursor = mongo.db.bookings.find(query).sort("created_at", -1).skip((page - 1) * limit).limit(limit)

        items = []
        for doc in cursor:
            # Enrich provider name and photo
            worker_user = mongo.db.users.find_one({"_id": doc["worker_id"]})
            worker_prof = mongo.db.worker_profiles.find_one({"user_id": doc["worker_id"]})
            doc["worker_name"] = worker_user.get("name") if worker_user else "Provider"
            doc["worker_photo_url"] = worker_prof.get("profile_photo_url") if worker_prof else None
            loc = mongo.db.localities.find_one({"_id": doc["service_locality_id"]})
            doc["locality_name"] = loc.get("name") if loc else ""
            items.append(doc)

        return items, total

    @staticmethod
    def list_worker_bookings(worker_user_id: str, status=None, page=1, limit=20):
        wid = parse_object_id(worker_user_id)
        query = {"worker_id": wid}
        if status:
            query["status"] = status

        total = mongo.db.bookings.count_documents(query)
        cursor = mongo.db.bookings.find(query).sort("created_at", -1).skip((page - 1) * limit).limit(limit)

        items = []
        for doc in cursor:
            cust_user = mongo.db.users.find_one({"_id": doc["customer_id"]})
            doc["customer_name"] = cust_user.get("name") if cust_user else "Customer"
            loc = mongo.db.localities.find_one({"_id": doc["service_locality_id"]})
            doc["locality_name"] = loc.get("name") if loc else ""
            items.append(doc)

        return items, total
