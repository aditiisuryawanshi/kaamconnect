from datetime import datetime, timezone
import re
from bson import ObjectId
from app.extensions import mongo
from app.common.errors import NotFoundError, ForbiddenError, BadRequestError
from app.common.validators import parse_object_id

class JobService:
    @staticmethod
    def create(employer_user_id: str, data: dict) -> dict:
        uid = parse_object_id(employer_user_id)
        now = datetime.now(timezone.utc)

        # Validate locality
        loc_id = parse_object_id(data.get("work_locality_id"), "work_locality_id")
        if not mongo.db.localities.find_one({"_id": loc_id, "active": True}):
            raise BadRequestError("Invalid or inactive worksite locality")

        cat_id = None
        if data.get("category_id"):
            cat_id = parse_object_id(data["category_id"])

        publish_now = data.get("publish_now", False)
        status = "published" if publish_now else "draft"

        doc = {
            "employer_id": uid,
            "title": data["title"].strip(),
            "category_id": cat_id,
            "description": data["description"].strip(),
            "employment_type": data["employment_type"],
            "responsibilities": data.get("responsibilities", []),
            "required_skills": data.get("required_skills", []),
            "preferred_skills": data.get("preferred_skills", []),
            "experience_requirements": data["experience_requirements"].strip(),
            "salary_min": float(data["salary_min"]),
            "salary_max": float(data["salary_max"]),
            "currency": data.get("currency", "INR"),
            "pay_period": data["pay_period"],
            "benefits": data.get("benefits", []),
            "work_locality_id": loc_id,
            "schedule": data["schedule"].strip(),
            "application_deadline": data.get("application_deadline"),
            "status": status,
            "moderation_status": "approved",
            "published_at": now if publish_now else None,
            "created_at": now,
            "updated_at": now
        }

        res = mongo.db.jobs.insert_one(doc)
        return JobService.get_by_id(str(res.inserted_id), employer_user_id)

    @staticmethod
    def update(job_id: str, employer_user_id: str, data: dict) -> dict:
        jid = parse_object_id(job_id)
        uid = parse_object_id(employer_user_id)

        existing = mongo.db.jobs.find_one({"_id": jid})
        if not existing:
            raise NotFoundError("Job not found")
        if existing["employer_id"] != uid:
            raise ForbiddenError("You can only modify your own job listings")

        now = datetime.now(timezone.utc)
        update_fields = {"updated_at": now}

        for key in ["title", "description", "employment_type", "responsibilities",
                    "required_skills", "preferred_skills", "experience_requirements",
                    "pay_period", "benefits", "schedule", "application_deadline"]:
            if key in data and data[key] is not None:
                update_fields[key] = data[key]

        if "salary_min" in data and data["salary_min"] is not None:
            update_fields["salary_min"] = float(data["salary_min"])
        if "salary_max" in data and data["salary_max"] is not None:
            update_fields["salary_max"] = float(data["salary_max"])
        if "work_locality_id" in data and data["work_locality_id"]:
            update_fields["work_locality_id"] = parse_object_id(data["work_locality_id"])
        if "category_id" in data and data["category_id"]:
            update_fields["category_id"] = parse_object_id(data["category_id"])

        mongo.db.jobs.update_one({"_id": jid}, {"$set": update_fields})
        return JobService.get_by_id(job_id, employer_user_id)

    @staticmethod
    def set_status(job_id: str, employer_user_id: str, new_status: str) -> dict:
        if new_status not in ["published", "closed", "draft"]:
            raise BadRequestError("Invalid status")
        jid = parse_object_id(job_id)
        uid = parse_object_id(employer_user_id)

        existing = mongo.db.jobs.find_one({"_id": jid})
        if not existing:
            raise NotFoundError("Job not found")
        if existing["employer_id"] != uid:
            raise ForbiddenError("You can only change status of your own job listings")

        now = datetime.now(timezone.utc)
        update = {"status": new_status, "updated_at": now}
        if new_status == "published" and not existing.get("published_at"):
            update["published_at"] = now

        mongo.db.jobs.update_one({"_id": jid}, {"$set": update})
        return JobService.get_by_id(job_id, employer_user_id)

    @staticmethod
    def get_by_id(job_id: str, current_user_id=None) -> dict:
        jid = parse_object_id(job_id)
        job = mongo.db.jobs.find_one({"_id": jid})
        if not job:
            raise NotFoundError("Job not found")

        # Employer details
        employer = mongo.db.employer_profiles.find_one({"owner_user_id": job["employer_id"]})
        job["employer_name"] = employer.get("name") if employer else "Employer"
        job["employer_type"] = employer.get("employer_type") if employer else "business"
        job["employer_logo_url"] = employer.get("logo_url") if employer else None
        job["employer_description"] = employer.get("description") if employer else ""

        # Locality
        loc = mongo.db.localities.find_one({"_id": job["work_locality_id"]})
        job["locality_name"] = loc.get("name") if loc else ""

        # Applications count
        app_count = mongo.db.applications.count_documents({"listing_type": "job", "listing_id": jid})
        job["applications_count"] = app_count

        # Check if current user is owner or applied
        is_owner = False
        has_applied = False
        user_app_status = None
        if current_user_id:
            uid = parse_object_id(current_user_id)
            is_owner = (job["employer_id"] == uid)
            app = mongo.db.applications.find_one({"listing_type": "job", "listing_id": jid, "worker_id": uid})
            if app:
                has_applied = True
                user_app_status = app.get("status")

        job["is_owner"] = is_owner
        job["has_applied"] = has_applied
        job["user_application_status"] = user_app_status

        return job

    @staticmethod
    def list_jobs(locality_id=None, employment_type=None, pay_period=None, keyword=None, min_salary=None, sort_by="newest", page=1, limit=12):
        query = {
            "status": "published",
            "moderation_status": "approved"
        }

        if locality_id:
            loc_oid = parse_object_id(locality_id)
            query["work_locality_id"] = loc_oid

        if employment_type:
            query["employment_type"] = employment_type

        if pay_period:
            query["pay_period"] = pay_period

        if keyword:
            safe_kw = re.escape(keyword.strip())
            query["$or"] = [
                {"title": {"$regex": safe_kw, "$options": "i"}},
                {"description": {"$regex": safe_kw, "$options": "i"}},
                {"required_skills": {"$in": [re.compile(safe_kw, re.I)]}}
            ]

        if min_salary is not None:
            query["salary_max"] = {"$gte": float(min_salary)}

        sort_field = [("published_at", -1)]
        if sort_by == "salary_desc":
            sort_field = [("salary_max", -1)]
        elif sort_by == "salary_asc":
            sort_field = [("salary_min", 1)]

        skip = (page - 1) * limit
        total = mongo.db.jobs.count_documents(query)
        cursor = mongo.db.jobs.find(query).sort(sort_field).skip(skip).limit(limit)

        items = []
        for doc in cursor:
            emp = mongo.db.employer_profiles.find_one({"owner_user_id": doc["employer_id"]})
            doc["employer_name"] = emp.get("name") if emp else "Employer"
            doc["employer_logo_url"] = emp.get("logo_url") if emp else None
            loc = mongo.db.localities.find_one({"_id": doc["work_locality_id"]})
            doc["locality_name"] = loc.get("name") if loc else ""
            items.append(doc)

        return items, total

    @staticmethod
    def get_my_jobs(employer_user_id: str):
        uid = parse_object_id(employer_user_id)
        cursor = mongo.db.jobs.find({"employer_id": uid}).sort("created_at", -1)
        items = []
        for doc in cursor:
            loc = mongo.db.localities.find_one({"_id": doc["work_locality_id"]})
            doc["locality_name"] = loc.get("name") if loc else ""
            doc["applications_count"] = mongo.db.applications.count_documents({
                "listing_type": "job",
                "listing_id": doc["_id"]
            })
            items.append(doc)
        return items
