from datetime import datetime, timezone
from bson import ObjectId
from app.extensions import mongo
from app.common.errors import NotFoundError, ForbiddenError, BadRequestError, ConflictError
from app.common.validators import parse_object_id
from app.services.notification_service import NotificationService

class ApplicationService:
    @staticmethod
    def apply(worker_user_id: str, data: dict) -> dict:
        wid = parse_object_id(worker_user_id)
        listing_type = data["listing_type"] # "gig" or "job"
        lid = parse_object_id(data["listing_id"])

        # Check listing existence and status
        if listing_type == "gig":
            listing = mongo.db.gigs.find_one({"_id": lid})
            if not listing or listing.get("status") != "published":
                raise BadRequestError("This gig is not open for applications")
            employer_id = listing["employer_id"]
            if listing.get("openings", 0) <= 0:
                raise BadRequestError("No more openings available for this gig")
        elif listing_type == "job":
            listing = mongo.db.jobs.find_one({"_id": lid})
            if not listing or listing.get("status") != "published":
                raise BadRequestError("This job is not open for applications")
            employer_id = listing["employer_id"]
        else:
            raise BadRequestError("Invalid listing type")

        if employer_id == wid:
            raise BadRequestError("You cannot apply to your own listing")

        # Check duplicate application
        existing = mongo.db.applications.find_one({
            "worker_id": wid,
            "listing_type": listing_type,
            "listing_id": lid
        })
        if existing:
            if existing.get("status") == "withdrawn":
                raise BadRequestError("You have previously withdrawn from this application")
            raise ConflictError("You have already applied to this opportunity")

        # Worker profile snapshot
        worker_user = mongo.db.users.find_one({"_id": wid})
        worker_prof = mongo.db.worker_profiles.find_one({"user_id": wid})

        now = datetime.now(timezone.utc)
        doc = {
            "worker_id": wid,
            "listing_type": listing_type,
            "listing_id": lid,
            "employer_id": employer_id,
            "profile_snapshot": {
                "name": worker_user.get("name") if worker_user else "Worker",
                "phone": worker_user.get("phone") if worker_user else None,
                "headline": worker_prof.get("headline") if worker_prof else "",
                "bio": worker_prof.get("bio") if worker_prof else "",
                "skills": worker_prof.get("skills", []) if worker_prof else [],
                "experience_years": worker_prof.get("experience_years", 0) if worker_prof else 0,
                "profile_photo_url": worker_prof.get("profile_photo_url") if worker_prof else None
            },
            "cover_note": (data.get("cover_note") or "").strip(),
            "status": "applied",
            "status_history": [
                {
                    "status": "applied",
                    "timestamp": now,
                    "notes": "Application submitted by worker"
                }
            ],
            "employer_notes": None,
            "applied_at": now,
            "updated_at": now,
            "withdrawn_at": None
        }

        res = mongo.db.applications.insert_one(doc)
        app_id = res.inserted_id

        # Notify employer
        NotificationService.notify(
            recipient_user_id=str(employer_id),
            event_type="application_received",
            title=f"New Applicant for {listing['title']}",
            message=f"{doc['profile_snapshot']['name']} has applied for your {listing_type} listing.",
            resource_type="application",
            resource_id=str(app_id)
        )

        return ApplicationService.get_application_details(str(app_id), worker_user_id)

    @staticmethod
    def withdraw(application_id: str, worker_user_id: str) -> dict:
        aid = parse_object_id(application_id)
        wid = parse_object_id(worker_user_id)

        app = mongo.db.applications.find_one({"_id": aid})
        if not app:
            raise NotFoundError("Application not found")
        if app["worker_id"] != wid:
            raise ForbiddenError("You can only withdraw your own applications")

        if app["status"] in ["selected", "rejected", "withdrawn"]:
            raise BadRequestError(f"Cannot withdraw application in '{app['status']}' state")

        now = datetime.now(timezone.utc)
        mongo.db.applications.update_one({"_id": aid}, {
            "$set": {
                "status": "withdrawn",
                "withdrawn_at": now,
                "updated_at": now
            },
            "$push": {
                "status_history": {
                    "status": "withdrawn",
                    "timestamp": now,
                    "notes": "Withdrawn by candidate"
                }
            }
        })

        return ApplicationService.get_application_details(application_id, worker_user_id)

    @staticmethod
    def get_application_details(application_id: str, current_user_id: str) -> dict:
        aid = parse_object_id(application_id)
        uid = parse_object_id(current_user_id)

        app = mongo.db.applications.find_one({"_id": aid})
        if not app:
            raise NotFoundError("Application not found")

        user = mongo.db.users.find_one({"_id": uid})
        is_admin = "admin" in (user.get("roles") if user else [])
        is_employer = (app["employer_id"] == uid)
        is_worker = (app["worker_id"] == uid)

        if not (is_worker or is_employer or is_admin):
            raise ForbiddenError("You are not authorized to view this application")

        # Fetch listing details
        if app["listing_type"] == "gig":
            listing = mongo.db.gigs.find_one({"_id": app["listing_id"]})
        else:
            listing = mongo.db.jobs.find_one({"_id": app["listing_id"]})

        app["listing_title"] = listing.get("title") if listing else "Listing"
        app["listing_status"] = listing.get("status") if listing else "unknown"

        # Employer profile info
        emp = mongo.db.employer_profiles.find_one({"owner_user_id": app["employer_id"]})
        app["employer_name"] = emp.get("name") if emp else "Employer"
        app["employer_logo_url"] = emp.get("logo_url") if emp else None

        # Worker perspective: Strip private employer notes
        if is_worker and not is_admin:
            app.pop("employer_notes", None)

        return app

    @staticmethod
    def list_my_applications(worker_user_id: str, listing_type=None, status=None, page=1, limit=20):
        wid = parse_object_id(worker_user_id)
        query = {"worker_id": wid}
        if listing_type:
            query["listing_type"] = listing_type
        if status:
            query["status"] = status

        total = mongo.db.applications.count_documents(query)
        cursor = mongo.db.applications.find(query).sort("applied_at", -1).skip((page - 1) * limit).limit(limit)

        items = []
        for doc in cursor:
            # Strip employer notes
            doc.pop("employer_notes", None)
            if doc["listing_type"] == "gig":
                l = mongo.db.gigs.find_one({"_id": doc["listing_id"]})
                if l:
                    loc = mongo.db.localities.find_one({"_id": l.get("work_locality_id")})
                    doc["locality_name"] = loc.get("name") if loc else ""
                    doc["pay_display"] = f"₹{l.get('pay_amount', 0)} / {l.get('pay_unit', 'shift')}"
            else:
                l = mongo.db.jobs.find_one({"_id": doc["listing_id"]})
                if l:
                    loc = mongo.db.localities.find_one({"_id": l.get("work_locality_id")})
                    doc["locality_name"] = loc.get("name") if loc else ""
                    doc["pay_display"] = f"₹{l.get('salary_min', 0)} - ₹{l.get('salary_max', 0)} / {l.get('pay_period', 'month')}"

            doc["listing_title"] = l.get("title") if l else "Listing"
            emp = mongo.db.employer_profiles.find_one({"owner_user_id": doc["employer_id"]})
            doc["employer_name"] = emp.get("name") if emp else "Employer"
            items.append(doc)

        return items, total

    @staticmethod
    def list_employer_applicants(employer_user_id: str, listing_type=None, listing_id=None, status=None, page=1, limit=20):
        eid = parse_object_id(employer_user_id)
        query = {"employer_id": eid}
        if listing_type:
            query["listing_type"] = listing_type
        if listing_id:
            query["listing_id"] = parse_object_id(listing_id)
        if status:
            query["status"] = status

        total = mongo.db.applications.count_documents(query)
        cursor = mongo.db.applications.find(query).sort("applied_at", -1).skip((page - 1) * limit).limit(limit)

        items = []
        for doc in cursor:
            if doc["listing_type"] == "gig":
                l = mongo.db.gigs.find_one({"_id": doc["listing_id"]})
            else:
                l = mongo.db.jobs.find_one({"_id": doc["listing_id"]})
            doc["listing_title"] = l.get("title") if l else "Listing"
            items.append(doc)

        return items, total

    @staticmethod
    def employer_update_status(application_id: str, employer_user_id: str, target_status: str, notes=None, reason=None) -> dict:
        aid = parse_object_id(application_id)
        eid = parse_object_id(employer_user_id)

        app = mongo.db.applications.find_one({"_id": aid})
        if not app:
            raise NotFoundError("Application not found")

        user = mongo.db.users.find_one({"_id": eid})
        is_admin = "admin" in (user.get("roles") if user else [])
        if app["employer_id"] != eid and not is_admin:
            raise ForbiddenError("You can only manage applicants for your own listings")

        if target_status not in ["under_review", "shortlisted", "selected", "rejected"]:
            raise BadRequestError(f"Invalid status transition to '{target_status}'")

        if app["status"] in ["withdrawn"]:
            raise BadRequestError("Candidate has already withdrawn this application")

        now = datetime.now(timezone.utc)

        # Concurrency check for gig selection: Ensure openings are not exceeded
        if target_status == "selected" and app["listing_type"] == "gig" and app["status"] != "selected":
            # Atomic decrement of openings
            updated_gig = mongo.db.gigs.find_one_and_update(
                {"_id": app["listing_id"], "openings": {"$gt": 0}},
                {"$inc": {"openings": -1}, "$set": {"updated_at": now}},
                return_document=True
            )
            if not updated_gig:
                raise ConflictError("All openings for this gig have already been filled.")

        update_query = {
            "$set": {
                "status": target_status,
                "updated_at": now
            },
            "$push": {
                "status_history": {
                    "status": target_status,
                    "timestamp": now,
                    "notes": notes or f"Candidate {target_status}"
                }
            }
        }
        if notes:
            update_query["$set"]["employer_notes"] = notes

        mongo.db.applications.update_one({"_id": aid}, update_query)

        # Send notification to worker
        NotificationService.notify(
            recipient_user_id=str(app["worker_id"]),
            event_type=f"application_{target_status}",
            title=f"Application Update: {target_status.replace('_', ' ').capitalize()}",
            message=f"Your application for {app.get('listing_type', 'opportunity')} has been marked as '{target_status}'.",
            resource_type="application",
            resource_id=str(aid)
        )

        return ApplicationService.get_application_details(application_id, employer_user_id)
