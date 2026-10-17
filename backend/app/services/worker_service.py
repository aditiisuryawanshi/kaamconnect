from datetime import datetime, timezone
from bson import ObjectId
from app.extensions import mongo
from app.common.errors import NotFoundError, BadRequestError
from app.common.validators import parse_object_id

class WorkerService:
    @staticmethod
    def get_profile(user_id: str) -> dict:
        uid = parse_object_id(user_id)
        profile = mongo.db.worker_profiles.find_one({"user_id": uid})
        if not profile:
            # Auto-create if not yet created
            now = datetime.now(timezone.utc)
            profile = {
                "user_id": uid,
                "headline": "",
                "bio": "",
                "profile_photo_url": None,
                "preferred_locality_ids": [],
                "work_preferences": ["services"],
                "skills": [],
                "experience_years": 0.0,
                "available_weekdays": ["mon", "tue", "wed", "thu", "fri", "sat"],
                "preferred_shifts": ["morning", "afternoon"],
                "profile_visibility": "public",
                "completion_percentage": 10,
                "created_at": now,
                "updated_at": now
            }
            res = mongo.db.worker_profiles.insert_one(profile)
            profile["_id"] = res.inserted_id

        # Also get user details (name, preferred language)
        user = mongo.db.users.find_one({"_id": uid})
        profile["user_name"] = user.get("name") if user else ""
        profile["user_email"] = user.get("email") if user else ""
        profile["user_phone"] = user.get("phone") if user else ""

        # Fetch locality details for display
        locality_ids = [parse_object_id(lid) for lid in profile.get("preferred_locality_ids", []) if ObjectId.is_valid(lid)]
        if locality_ids:
            localities = list(mongo.db.localities.find({"_id": {"$in": locality_ids}}))
            profile["preferred_localities"] = [{"id": str(l["_id"]), "name": l["name"]} for l in localities]
        else:
            profile["preferred_localities"] = []

        return profile

    @staticmethod
    def update_profile(user_id: str, data: dict) -> dict:
        uid = parse_object_id(user_id)
        existing = mongo.db.worker_profiles.find_one({"user_id": uid})
        if not existing:
            raise NotFoundError("Worker profile not found")

        now = datetime.now(timezone.utc)
        update_fields = {}
        for key in ["headline", "bio", "profile_photo_url", "preferred_locality_ids",
                    "work_preferences", "skills", "experience_years", "profile_visibility",
                    "available_weekdays", "preferred_shifts"]:
            if key in data and data[key] is not None:
                update_fields[key] = data[key]

        # Calculate completion percentage
        score = 0
        if update_fields.get("headline", existing.get("headline")): score += 20
        if update_fields.get("bio", existing.get("bio")): score += 20
        if update_fields.get("skills", existing.get("skills")): score += 20
        if update_fields.get("preferred_locality_ids", existing.get("preferred_locality_ids")): score += 20
        if update_fields.get("profile_photo_url", existing.get("profile_photo_url")): score += 20
        update_fields["completion_percentage"] = min(100, score)
        update_fields["updated_at"] = now

        mongo.db.worker_profiles.update_one({"user_id": uid}, {"$set": update_fields})
        return WorkerService.get_profile(user_id)

    @staticmethod
    def complete_onboarding(user_id: str, data: dict) -> dict:
        uid = parse_object_id(user_id)
        # Ensure user has worker role
        user = mongo.db.users.find_one({"_id": uid})
        if "worker" not in user.get("roles", []):
            mongo.db.users.update_one({"_id": uid}, {"$addToSet": {"roles": "worker"}})

        return WorkerService.update_profile(user_id, data)

    @staticmethod
    def get_public_provider_profile(provider_id: str) -> dict:
        """
        Public provider view: strips private contact details like phone & raw email.
        """
        pid = parse_object_id(provider_id)
        profile = mongo.db.worker_profiles.find_one({"_id": pid})
        if not profile:
            # Check if provider_id was user_id
            profile = mongo.db.worker_profiles.find_one({"user_id": pid})
        
        if not profile or profile.get("profile_visibility") == "private":
            raise NotFoundError("Provider profile not found or is set to private")

        user = mongo.db.users.find_one({"_id": profile["user_id"]})
        if not user or user.get("account_status") == "suspended":
            raise NotFoundError("Provider is currently unavailable")

        # Fetch active published service listings by this worker
        listings = list(mongo.db.service_listings.find({
            "worker_id": profile["user_id"],
            "status": "published",
            "moderation_status": "approved"
        }).sort("created_at", -1))

        # Fetch localities
        loc_ids = [parse_object_id(l) for l in profile.get("preferred_locality_ids", []) if ObjectId.is_valid(l)]
        localities = list(mongo.db.localities.find({"_id": {"$in": loc_ids}})) if loc_ids else []

        # Reviews if any
        reviews = list(mongo.db.reviews.find({
            "worker_id": profile["user_id"],
            "moderation_status": "approved"
        }).sort("created_at", -1).limit(10))

        avg_rating = 0.0
        if reviews:
            avg_rating = round(sum(r.get("rating", 0) for r in reviews) / len(reviews), 1)

        return {
            "id": str(profile["_id"]),
            "user_id": str(profile["user_id"]),
            "name": user.get("name"),
            "user_name": user.get("name"),
            "headline": profile.get("headline"),
            "bio": profile.get("bio"),
            "profile_photo_url": profile.get("profile_photo_url"),
            "photo_alt_text": profile.get("photo_alt_text"),
            "photo_source": profile.get("photo_source"),
            "photo_license": profile.get("photo_license"),
            "is_demo": profile.get("is_demo", False),
            "skills": profile.get("skills", []),
            "experience_years": profile.get("experience_years", 0),
            "available_weekdays": profile.get("available_weekdays", []),
            "preferred_shifts": profile.get("preferred_shifts", []),
            "preferred_localities": [{"id": str(l["_id"]), "name": l["name"]} for l in localities],
            "listings": listings,
            "reviews": reviews,
            "average_rating": avg_rating if reviews else None,
            "review_count": len(reviews)
        }
