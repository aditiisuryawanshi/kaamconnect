from datetime import datetime, timezone
from bson import ObjectId
from app.extensions import mongo
from app.common.errors import NotFoundError, BadRequestError
from app.common.validators import parse_object_id

class EmployerService:
    @staticmethod
    def get_profile(user_id: str) -> dict:
        uid = parse_object_id(user_id)
        profile = mongo.db.employer_profiles.find_one({"owner_user_id": uid})
        if not profile:
            # Auto-create if not yet created
            now = datetime.now(timezone.utc)
            user = mongo.db.users.find_one({"_id": uid})
            name = user.get("name", "Employer") if user else "Employer"
            profile = {
                "owner_user_id": uid,
                "name": name,
                "employer_type": "individual",
                "description": "",
                "logo_url": None,
                "contact_phone": user.get("phone") if user else None,
                "contact_email": user.get("email") if user else None,
                "website": None,
                "locality_id": None,
                "address": None,
                "verification_status": "unverified",
                "account_status": "active",
                "created_at": now,
                "updated_at": now
            }
            res = mongo.db.employer_profiles.insert_one(profile)
            profile["_id"] = res.inserted_id

        if profile.get("locality_id") and ObjectId.is_valid(profile["locality_id"]):
            loc = mongo.db.localities.find_one({"_id": ObjectId(profile["locality_id"])})
            if loc:
                profile["locality_name"] = loc.get("name")

        return profile

    @staticmethod
    def update_profile(user_id: str, data: dict) -> dict:
        uid = parse_object_id(user_id)
        existing = mongo.db.employer_profiles.find_one({"owner_user_id": uid})
        if not existing:
            raise NotFoundError("Employer profile not found")

        now = datetime.now(timezone.utc)
        update_fields = {}
        for key in ["name", "employer_type", "description", "logo_url",
                    "contact_phone", "contact_email", "website", "locality_id", "address"]:
            if key in data and data[key] is not None:
                update_fields[key] = data[key]
        update_fields["updated_at"] = now

        mongo.db.employer_profiles.update_one({"owner_user_id": uid}, {"$set": update_fields})
        return EmployerService.get_profile(user_id)

    @staticmethod
    def get_dashboard(user_id: str) -> dict:
        uid = parse_object_id(user_id)
        # Active gigs
        active_gigs = mongo.db.gigs.count_documents({"employer_id": uid, "status": "published"})
        # Active jobs
        active_jobs = mongo.db.jobs.count_documents({"employer_id": uid, "status": "published"})
        # Total applicants awaiting review
        pending_applicants = mongo.db.applications.count_documents({
            "employer_id": uid,
            "status": {"$in": ["applied", "under_review"]}
        })
        # Shortlisted applicants
        shortlisted_applicants = mongo.db.applications.count_documents({
            "employer_id": uid,
            "status": "shortlisted"
        })

        # Recent applications
        recent_applications = list(mongo.db.applications.find({"employer_id": uid}).sort("applied_at", -1).limit(5))
        for app in recent_applications:
            # Attach worker details
            worker = mongo.db.users.find_one({"_id": app["worker_id"]})
            w_prof = mongo.db.worker_profiles.find_one({"user_id": app["worker_id"]})
            app["worker_name"] = worker.get("name") if worker else "Worker"
            app["worker_headline"] = w_prof.get("headline") if w_prof else ""
            # Attach listing title
            if app["listing_type"] == "gig":
                listing = mongo.db.gigs.find_one({"_id": app["listing_id"]})
            else:
                listing = mongo.db.jobs.find_one({"_id": app["listing_id"]})
            app["listing_title"] = listing.get("title") if listing else "Listing"

        # Recent listings
        recent_gigs = list(mongo.db.gigs.find({"employer_id": uid}).sort("created_at", -1).limit(5))
        recent_jobs = list(mongo.db.jobs.find({"employer_id": uid}).sort("created_at", -1).limit(5))

        return {
            "active_gigs_count": active_gigs,
            "active_jobs_count": active_jobs,
            "pending_applicants_count": pending_applicants,
            "shortlisted_applicants_count": shortlisted_applicants,
            "recent_applications": recent_applications,
            "recent_gigs": recent_gigs,
            "recent_jobs": recent_jobs
        }
