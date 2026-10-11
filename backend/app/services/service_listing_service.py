from datetime import datetime, timezone
import re
from bson import ObjectId
from app.extensions import mongo
from app.common.errors import NotFoundError, ForbiddenError, BadRequestError
from app.common.validators import parse_object_id

class ServiceListingService:
    @staticmethod
    def create(worker_user_id: str, data: dict) -> dict:
        uid = parse_object_id(worker_user_id)
        now = datetime.now(timezone.utc)

        # Validate category exists
        cat_id = parse_object_id(data.get("category_id"), "category_id")
        category = mongo.db.service_categories.find_one({"_id": cat_id, "active": True})
        if not category:
            raise BadRequestError("Invalid or inactive service category")

        # Validate service area localities
        area_ids = []
        for aid in data.get("service_area_ids", []):
            area_oid = parse_object_id(aid, "service_area_id")
            if mongo.db.localities.find_one({"_id": area_oid, "active": True}):
                area_ids.append(area_oid)

        if not area_ids:
            raise BadRequestError("At least one valid active locality is required for service areas")

        publish_now = data.get("publish_now", False)
        status = "published" if publish_now else "draft"

        doc = {
            "worker_id": uid,
            "category_id": cat_id,
            "title": data["title"].strip(),
            "description": data["description"].strip(),
            "pricing": data["pricing"],
            "service_area_ids": area_ids,
            "available_days": data.get("available_days", ["mon", "tue", "wed", "thu", "fri", "sat"]),
            "time_slots": data.get("time_slots", ["09:00 - 13:00", "14:00 - 18:00"]),
            "booking_lead_time_hours": data.get("booking_lead_time_hours", 2),
            "image_urls": data.get("image_urls", []),
            "status": status,
            "moderation_status": "approved", # Default approved in demo/dev mode
            "published_at": now if publish_now else None,
            "created_at": now,
            "updated_at": now
        }
        res = mongo.db.service_listings.insert_one(doc)
        doc["_id"] = res.inserted_id
        return ServiceListingService.get_by_id(str(res.inserted_id))

    @staticmethod
    def update(listing_id: str, worker_user_id: str, data: dict) -> dict:
        lid = parse_object_id(listing_id)
        uid = parse_object_id(worker_user_id)

        existing = mongo.db.service_listings.find_one({"_id": lid})
        if not existing:
            raise NotFoundError("Service listing not found")
        if existing["worker_id"] != uid:
            raise ForbiddenError("You can only modify your own service listings")

        now = datetime.now(timezone.utc)
        update_fields = {"updated_at": now}

        if "title" in data and data["title"]:
            update_fields["title"] = data["title"].strip()
        if "description" in data and data["description"]:
            update_fields["description"] = data["description"].strip()
        if "pricing" in data and data["pricing"]:
            update_fields["pricing"] = data["pricing"]
        if "category_id" in data and data["category_id"]:
            cat_id = parse_object_id(data["category_id"], "category_id")
            update_fields["category_id"] = cat_id
        if "service_area_ids" in data and data["service_area_ids"]:
            update_fields["service_area_ids"] = [parse_object_id(a) for a in data["service_area_ids"]]
        if "available_days" in data:
            update_fields["available_days"] = data["available_days"]
        if "time_slots" in data:
            update_fields["time_slots"] = data["time_slots"]
        if "booking_lead_time_hours" in data:
            update_fields["booking_lead_time_hours"] = data["booking_lead_time_hours"]
        if "image_urls" in data:
            update_fields["image_urls"] = data["image_urls"]

        mongo.db.service_listings.update_one({"_id": lid}, {"$set": update_fields})
        return ServiceListingService.get_by_id(listing_id)

    @staticmethod
    def set_status(listing_id: str, worker_user_id: str, new_status: str) -> dict:
        if new_status not in ["published", "paused", "archived", "draft"]:
            raise BadRequestError("Invalid status")
        lid = parse_object_id(listing_id)
        uid = parse_object_id(worker_user_id)

        existing = mongo.db.service_listings.find_one({"_id": lid})
        if not existing:
            raise NotFoundError("Service listing not found")
        if existing["worker_id"] != uid:
            raise ForbiddenError("You can only change status of your own service listings")

        now = datetime.now(timezone.utc)
        update = {"status": new_status, "updated_at": now}
        if new_status == "published" and not existing.get("published_at"):
            update["published_at"] = now

        mongo.db.service_listings.update_one({"_id": lid}, {"$set": update})
        return ServiceListingService.get_by_id(listing_id)

    @staticmethod
    def get_by_id(listing_id: str) -> dict:
        lid = parse_object_id(listing_id)
        listing = mongo.db.service_listings.find_one({"_id": lid})
        if not listing:
            raise NotFoundError("Service listing not found")

        # Attach worker info
        worker_user = mongo.db.users.find_one({"_id": listing["worker_id"]})
        worker_prof = mongo.db.worker_profiles.find_one({"user_id": listing["worker_id"]})
        listing["worker_name"] = worker_user.get("name") if worker_user else "Worker"
        listing["worker_headline"] = worker_prof.get("headline") if worker_prof else ""
        listing["worker_photo_url"] = worker_prof.get("profile_photo_url") if worker_prof else None
        listing["worker_experience_years"] = worker_prof.get("experience_years", 0) if worker_prof else 0
        listing["worker_profile_id"] = str(worker_prof["_id"]) if worker_prof else None

        # Attach category
        cat = mongo.db.service_categories.find_one({"_id": listing["category_id"]})
        listing["category_name"] = cat.get("name") if cat else ""
        listing["category_slug"] = cat.get("slug") if cat else ""

        # Attach localities
        loc_ids = listing.get("service_area_ids", [])
        localities = list(mongo.db.localities.find({"_id": {"$in": loc_ids}}))
        listing["service_areas"] = [{"id": str(l["_id"]), "name": l["name"]} for l in localities]

        return listing

    @staticmethod
    def list_services(category_slug=None, locality_id=None, keyword=None, min_price=None, max_price=None, sort_by="newest", page=1, limit=12):
        query = {
            "status": "published",
            "moderation_status": "approved"
        }

        if category_slug:
            cat = mongo.db.service_categories.find_one({"slug": category_slug})
            if cat:
                query["category_id"] = cat["_id"]
            else:
                return [], 0

        if locality_id:
            loc_oid = parse_object_id(locality_id)
            query["service_area_ids"] = loc_oid

        if keyword:
            safe_kw = re.escape(keyword.strip())
            query["$or"] = [
                {"title": {"$regex": safe_kw, "$options": "i"}},
                {"description": {"$regex": safe_kw, "$options": "i"}}
            ]

        if min_price is not None or max_price is not None:
            price_query = {}
            if min_price is not None:
                price_query["$gte"] = float(min_price)
            if max_price is not None:
                price_query["$lte"] = float(max_price)
            query["pricing.amount"] = price_query

        # Sorting
        sort_field = [("published_at", -1)]
        if sort_by == "price_asc":
            sort_field = [("pricing.amount", 1)]
        elif sort_by == "price_desc":
            sort_field = [("pricing.amount", -1)]
        elif sort_by == "newest":
            sort_field = [("published_at", -1)]

        skip = (page - 1) * limit
        total = mongo.db.service_listings.count_documents(query)
        cursor = mongo.db.service_listings.find(query).sort(sort_field).skip(skip).limit(limit)

        items = []
        for doc in cursor:
            # Enrich
            worker_user = mongo.db.users.find_one({"_id": doc["worker_id"]})
            worker_prof = mongo.db.worker_profiles.find_one({"user_id": doc["worker_id"]})
            cat = mongo.db.service_categories.find_one({"_id": doc["category_id"]})
            doc["worker_name"] = worker_user.get("name") if worker_user else "Worker"
            doc["worker_photo_url"] = worker_prof.get("profile_photo_url") if worker_prof else None
            doc["worker_headline"] = worker_prof.get("headline") if worker_prof else ""
            doc["worker_profile_id"] = str(worker_prof["_id"]) if worker_prof else None
            doc["category_name"] = cat.get("name") if cat else ""

            # Area names
            loc_ids = doc.get("service_area_ids", [])
            localities = list(mongo.db.localities.find({"_id": {"$in": loc_ids}}))
            doc["service_areas"] = [{"id": str(l["_id"]), "name": l["name"]} for l in localities]

            items.append(doc)

        return items, total

    @staticmethod
    def get_my_services(worker_user_id: str):
        uid = parse_object_id(worker_user_id)
        cursor = mongo.db.service_listings.find({"worker_id": uid}).sort("created_at", -1)
        items = []
        for doc in cursor:
            cat = mongo.db.service_categories.find_one({"_id": doc["category_id"]})
            doc["category_name"] = cat.get("name") if cat else ""
            items.append(doc)
        return items
