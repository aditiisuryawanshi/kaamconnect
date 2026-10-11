from datetime import datetime, timezone
from bson import ObjectId
from app.extensions import mongo
from app.common.errors import BadRequestError, ConflictError, UnauthorizedError, NotFoundError
from app.common.validators import normalize_email, normalize_phone
from app.common.permissions import hash_password, verify_password, generate_token

class AuthService:
    @staticmethod
    def register(data: dict) -> dict:
        email = normalize_email(data.get("email"))
        phone = normalize_phone(data.get("phone"))
        name = data.get("name", "").strip()
        password = data.get("password")
        role = data.get("role", "worker")
        preferred_language = data.get("preferred_language", "en")

        # Check existing user by email
        if mongo.db.users.find_one({"normalized_email": email}):
            raise ConflictError("An account with this email address already exists")

        if phone and mongo.db.users.find_one({"normalized_phone": phone}):
            raise ConflictError("An account with this phone number already exists")

        now = datetime.now(timezone.utc)
        user_doc = {
            "name": name,
            "email": email,
            "normalized_email": email,
            "password_hash": hash_password(password),
            "roles": [role],
            "preferred_language": preferred_language,
            "account_status": "active",
            "created_at": now,
            "updated_at": now,
            "last_login_at": now
        }
        if phone:
            user_doc["phone"] = phone
            user_doc["normalized_phone"] = phone

        res = mongo.db.users.insert_one(user_doc)
        user_id = str(res.inserted_id)

        # If role is worker, auto-create a starter worker_profile
        if role == "worker":
            mongo.db.worker_profiles.insert_one({
                "user_id": ObjectId(user_id),
                "headline": "Service Professional",
                "bio": "Experienced local worker ready to help.",
                "profile_photo_url": None,
                "preferred_locality_ids": [],
                "work_preferences": ["services", "gigs"],
                "skills": [],
                "experience_years": 1.0,
                "available_weekdays": ["mon", "tue", "wed", "thu", "fri", "sat"],
                "preferred_shifts": ["morning", "afternoon"],
                "profile_visibility": "public",
                "completion_percentage": 25,
                "created_at": now,
                "updated_at": now
            })

        # If role is employer, auto-create a starter employer_profile
        if role == "employer":
            mongo.db.employer_profiles.insert_one({
                "owner_user_id": ObjectId(user_id),
                "name": name,
                "employer_type": "individual",
                "description": f"Employer profile for {name}",
                "logo_url": None,
                "contact_phone": phone,
                "contact_email": email,
                "website": None,
                "locality_id": None,
                "verification_status": "unverified",
                "account_status": "active",
                "created_at": now,
                "updated_at": now
            })

        token = generate_token(user_id, email, [role])
        return {
            "token": token,
            "user": {
                "id": user_id,
                "name": name,
                "email": email,
                "phone": phone,
                "roles": [role],
                "preferred_language": preferred_language
            }
        }

    @staticmethod
    def login(data: dict) -> dict:
        email = normalize_email(data.get("email"))
        password = data.get("password")

        user = mongo.db.users.find_one({"normalized_email": email})
        if not user or not verify_password(password, user.get("password_hash", "")):
            raise UnauthorizedError("Invalid email or password")

        if user.get("account_status") == "suspended":
            raise UnauthorizedError("Account has been suspended. Please contact platform support.")

        now = datetime.now(timezone.utc)
        mongo.db.users.update_one({"_id": user["_id"]}, {"$set": {"last_login_at": now}})

        user_id = str(user["_id"])
        roles = user.get("roles", ["customer"])
        token = generate_token(user_id, email, roles)

        return {
            "token": token,
            "user": {
                "id": user_id,
                "name": user.get("name"),
                "email": user.get("email"),
                "phone": user.get("phone"),
                "roles": roles,
                "preferred_language": user.get("preferred_language", "en")
            }
        }

    @staticmethod
    def get_me(user: dict) -> dict:
        user_id = user["_id"]
        # Fetch related profile info if relevant
        worker_profile = mongo.db.worker_profiles.find_one({"user_id": user_id})
        employer_profile = mongo.db.employer_profiles.find_one({"owner_user_id": user_id})

        return {
            "id": str(user_id),
            "name": user.get("name"),
            "email": user.get("email"),
            "phone": user.get("phone"),
            "roles": user.get("roles", []),
            "preferred_language": user.get("preferred_language", "en"),
            "account_status": user.get("account_status", "active"),
            "has_worker_profile": worker_profile is not None,
            "has_employer_profile": employer_profile is not None,
            "worker_profile_completion": worker_profile.get("completion_percentage", 0) if worker_profile else 0
        }

    @staticmethod
    def add_role(user: dict, new_role: str) -> dict:
        if new_role not in ["worker", "customer", "employer"]:
            raise BadRequestError("Invalid role")

        roles = user.get("roles", [])
        if new_role not in roles:
            roles.append(new_role)
            now = datetime.now(timezone.utc)
            mongo.db.users.update_one(
                {"_id": user["_id"]},
                {"$set": {"roles": roles, "updated_at": now}}
            )

            # Auto-provision profile if newly added
            if new_role == "worker" and not mongo.db.worker_profiles.find_one({"user_id": user["_id"]}):
                mongo.db.worker_profiles.insert_one({
                    "user_id": user["_id"],
                    "headline": "Service Professional",
                    "bio": "Experienced local worker ready to help.",
                    "profile_photo_url": None,
                    "preferred_locality_ids": [],
                    "work_preferences": ["services", "gigs"],
                    "skills": [],
                    "experience_years": 1.0,
                    "available_weekdays": ["mon", "tue", "wed", "thu", "fri", "sat"],
                    "preferred_shifts": ["morning", "afternoon"],
                    "profile_visibility": "public",
                    "completion_percentage": 25,
                    "created_at": now,
                    "updated_at": now
                })
            
            if new_role == "employer" and not mongo.db.employer_profiles.find_one({"owner_user_id": user["_id"]}):
                mongo.db.employer_profiles.insert_one({
                    "owner_user_id": user["_id"],
                    "name": user.get("name"),
                    "employer_type": "individual",
                    "description": f"Employer profile for {user.get('name')}",
                    "logo_url": None,
                    "contact_phone": user.get("phone"),
                    "contact_email": user.get("email"),
                    "website": None,
                    "locality_id": None,
                    "verification_status": "unverified",
                    "account_status": "active",
                    "created_at": now,
                    "updated_at": now
                })

        token = generate_token(str(user["_id"]), user.get("email"), roles)
        return {
            "token": token,
            "roles": roles
        }
