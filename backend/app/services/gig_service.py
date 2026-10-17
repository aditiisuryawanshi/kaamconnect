from datetime import datetime, timezone
import re
from bson import ObjectId
from app.extensions import mongo
from app.common.errors import NotFoundError, ForbiddenError, BadRequestError
from app.common.validators import parse_object_id

class GigService:
    @staticmethod
    def create(employer_user_id: str, data: dict) -> dict:
        uid = parse_object_id(employer_user_id)
        now = datetime.now(timezone.utc)

        # Validate locality
        loc_id = parse_object_id(data.get("work_locality_id"), "work_locality_id")
        if not mongo.db.localities.find_one({"_id": loc_id, "active": True}):
            raise BadRequestError("Invalid or inactive worksite locality")

        # Validate category
        cat_id = parse_object_id(data.get("category_id"), "category_id")
        if not mongo.db.service_categories.find_one({"_id": cat_id, "active": True}):
            raise BadRequestError("Invalid or inactive category")

        publish_now = data.get("publish_now", False)
        status = "published" if publish_now else "draft"

        doc = {
            "employer_id": uid,
            "title": data["title"].strip(),
            "category_id": cat_id,
            "description": data["description"].strip(),
            "responsibilities": data.get("responsibilities", []),
            "required_skills": data.get("required_skills", []),
            "work_locality_id": loc_id,
            "work_address_private": (data.get("work_address") or "").strip(),
            "shift_date": data["shift_date"],
            "start_time": data["start_time"],
            "end_time": data["end_time"],
            "is_overnight": data.get("is_overnight", False),
            "duration_hours": float(data["duration_hours"]),
            "openings": int(data["openings"]),
            "initial_openings": int(data["openings"]),
            "pay_amount": float(data["pay_amount"]),
            "currency": data.get("currency", "INR"),
            "pay_unit": data["pay_unit"],
            "payment_conditions": (data.get("payment_conditions") or "").strip(),
            "experience_requirements": (data.get("experience_requirements") or "").strip(),
            "application_deadline": data.get("application_deadline"),
            "status": status,
            "moderation_status": "approved",
            "published_at": now if publish_now else None,
            "created_at": now,
            "updated_at": now
        }

        res = mongo.db.gigs.insert_one(doc)
        return GigService.get_by_id(str(res.inserted_id), employer_user_id)

    @staticmethod
    def update(gig_id: str, employer_user_id: str, data: dict) -> dict:
        gid = parse_object_id(gig_id)
        uid = parse_object_id(employer_user_id)

        existing = mongo.db.gigs.find_one({"_id": gid})
        if not existing:
            raise NotFoundError("Gig not found")
        if existing["employer_id"] != uid:
            raise ForbiddenError("You can only modify your own gig listings")

        now = datetime.now(timezone.utc)
        update_fields = {"updated_at": now}

        for key in ["title", "description", "responsibilities", "required_skills",
                    "shift_date", "start_time", "end_time", "is_overnight",
                    "payment_conditions", "experience_requirements", "application_deadline"]:
            if key in data and data[key] is not None:
                update_fields[key] = data[key]

        if "openings" in data and data["openings"] is not None:
            update_fields["openings"] = int(data["openings"])
        if "pay_amount" in data and data["pay_amount"] is not None:
            update_fields["pay_amount"] = float(data["pay_amount"])
        if "pay_unit" in data and data["pay_unit"] is not None:
            update_fields["pay_unit"] = data["pay_unit"]
        if "work_locality_id" in data and data["work_locality_id"]:
            update_fields["work_locality_id"] = parse_object_id(data["work_locality_id"])
        if "category_id" in data and data["category_id"]:
            update_fields["category_id"] = parse_object_id(data["category_id"])
        if "work_address" in data:
            update_fields["work_address_private"] = data["work_address"]

        mongo.db.gigs.update_one({"_id": gid}, {"$set": update_fields})
        return GigService.get_by_id(gig_id, employer_user_id)

    @staticmethod
    def set_status(gig_id: str, employer_user_id: str, new_status: str) -> dict:
        if new_status not in ["published", "closed", "draft"]:
            raise BadRequestError("Invalid status")
        gid = parse_object_id(gig_id)
        uid = parse_object_id(employer_user_id)

        existing = mongo.db.gigs.find_one({"_id": gid})
        if not existing:
            raise NotFoundError("Gig not found")
        if existing["employer_id"] != uid:
            raise ForbiddenError("You can only change status of your own gig listings")

        now = datetime.now(timezone.utc)
        update = {"status": new_status, "updated_at": now}
        if new_status == "published" and not existing.get("published_at"):
            update["published_at"] = now

        mongo.db.gigs.update_one({"_id": gid}, {"$set": update})
        return GigService.get_by_id(gig_id, employer_user_id)

    @staticmethod
    def get_by_id(gig_id: str, current_user_id=None) -> dict:
        gid = parse_object_id(gig_id)
        gig = mongo.db.gigs.find_one({"_id": gid})
        if not gig:
            raise NotFoundError("Gig not found")

        # Employer details
        employer = mongo.db.employer_profiles.find_one({"owner_user_id": gig["employer_id"]})
        gig["employer_name"] = employer.get("name") if employer else "Employer"
        gig["employer_type"] = employer.get("employer_type") if employer else "business"
        gig["employer_logo_url"] = employer.get("logo_url") if employer else None
        gig["employer_logo_alt_text"] = employer.get("logo_alt_text") if employer else None
        gig["employer_is_demo"] = employer.get("is_demo", False) if employer else False

        # Locality & category
        loc = mongo.db.localities.find_one({"_id": gig["work_locality_id"]})
        gig["locality_name"] = loc.get("name") if loc else ""
        cat = mongo.db.service_categories.find_one({"_id": gig["category_id"]})
        gig["category_name"] = cat.get("name") if cat else ""

        # Applications count
        app_count = mongo.db.applications.count_documents({"listing_type": "gig", "listing_id": gid})
        gig["applications_count"] = app_count

        # Check if current user is owner or has applied
        is_owner = False
        has_applied = False
        user_app_status = None
        if current_user_id:
            uid = parse_object_id(current_user_id)
            is_owner = (gig["employer_id"] == uid)
            app = mongo.db.applications.find_one({"listing_type": "gig", "listing_id": gid, "worker_id": uid})
            if app:
                has_applied = True
                user_app_status = app.get("status")

        gig["is_owner"] = is_owner
        gig["has_applied"] = has_applied
        gig["user_application_status"] = user_app_status

        # Hide private work address if not owner and not selected applicant
        if not is_owner and user_app_status != "selected":
            gig.pop("work_address_private", None)

        return gig

    @staticmethod
    def list_gigs(locality_id=None, category_slug=None, keyword=None, role=None, min_pay=None, max_pay=None, sort_by="newest", page=1, limit=12):
        query = {
            "status": "published",
            "moderation_status": "approved"
        }

        if locality_id:
            loc_oid = parse_object_id(locality_id)
            query["work_locality_id"] = loc_oid

        if category_slug:
            cat = mongo.db.service_categories.find_one({"slug": category_slug})
            if cat:
                query["category_id"] = cat["_id"]
            else:
                return [], 0

        if role:
            safe_role = re.escape(role.strip())
            query["$or"] = [
                {"role_slug": safe_role},
                {"title": {"$regex": safe_role, "$options": "i"}}
            ]

        if keyword:
            safe_kw = re.escape(keyword.strip())
            kw_condition = [
                {"title": {"$regex": safe_kw, "$options": "i"}},
                {"description": {"$regex": safe_kw, "$options": "i"}},
                {"required_skills": {"$in": [re.compile(safe_kw, re.I)]}}
            ]
            if "$or" in query:
                query["$and"] = [{"$or": query.pop("$or")}, {"$or": kw_condition}]
            else:
                query["$or"] = kw_condition

        if min_pay is not None or max_pay is not None:
            pay_query = {}
            if min_pay is not None:
                pay_query["$gte"] = float(min_pay)
            if max_pay is not None:
                pay_query["$lte"] = float(max_pay)
            query["pay_amount"] = pay_query

        sort_field = [("published_at", -1)]
        if sort_by == "pay_desc":
            sort_field = [("pay_amount", -1)]
        elif sort_by == "pay_asc":
            sort_field = [("pay_amount", 1)]

        skip = (page - 1) * limit
        total = mongo.db.gigs.count_documents(query)
        cursor = mongo.db.gigs.find(query).sort(sort_field).skip(skip).limit(limit)

        items = []
        for doc in cursor:
            # Strip private address in listing cards
            doc.pop("work_address_private", None)
            emp = mongo.db.employer_profiles.find_one({"owner_user_id": doc["employer_id"]})
            doc["employer_name"] = emp.get("name") if emp else "Employer"
            doc["employer_logo_url"] = emp.get("logo_url") if emp else None
            doc["employer_logo_alt_text"] = emp.get("logo_alt_text") if emp else None
            doc["employer_is_demo"] = emp.get("is_demo", False) if emp else False
            loc = mongo.db.localities.find_one({"_id": doc["work_locality_id"]})
            doc["locality_name"] = loc.get("name") if loc else ""
            cat = mongo.db.service_categories.find_one({"_id": doc["category_id"]})
            doc["category_name"] = cat.get("name") if cat else ""
            items.append(doc)

        return items, total

    @staticmethod
    def get_my_gigs(employer_user_id: str):
        uid = parse_object_id(employer_user_id)
        cursor = mongo.db.gigs.find({"employer_id": uid}).sort("created_at", -1)
        items = []
        for doc in cursor:
            loc = mongo.db.localities.find_one({"_id": doc["work_locality_id"]})
            doc["locality_name"] = loc.get("name") if loc else ""
            doc["applications_count"] = mongo.db.applications.count_documents({
                "listing_type": "gig",
                "listing_id": doc["_id"]
            })
            items.append(doc)
        return items
