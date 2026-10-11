from datetime import datetime, timezone
from bson import ObjectId
from app.extensions import mongo
from app.common.errors import NotFoundError, BadRequestError, ConflictError
from app.common.validators import parse_object_id

class SavedService:
    @staticmethod
    def toggle_save(user_id: str, listing_type: str, listing_id: str) -> dict:
        uid = parse_object_id(user_id)
        lid = parse_object_id(listing_id)
        if listing_type not in ["service", "gig", "job"]:
            raise BadRequestError("Invalid listing type")

        existing = mongo.db.saved_listings.find_one({
            "user_id": uid,
            "listing_type": listing_type,
            "listing_id": lid
        })

        if existing:
            mongo.db.saved_listings.delete_one({"_id": existing["_id"]})
            return {"saved": False, "id": str(existing["_id"])}

        now = datetime.now(timezone.utc)
        doc = {
            "user_id": uid,
            "listing_type": listing_type,
            "listing_id": lid,
            "created_at": now
        }
        res = mongo.db.saved_listings.insert_one(doc)
        return {"saved": True, "id": str(res.inserted_id)}

    @staticmethod
    def list_saved(user_id: str, listing_type=None):
        uid = parse_object_id(user_id)
        query = {"user_id": uid}
        if listing_type:
            query["listing_type"] = listing_type

        cursor = mongo.db.saved_listings.find(query).sort("created_at", -1)
        items = []
        for doc in cursor:
            # Enrich with entity details
            ltype = doc["listing_type"]
            lid = doc["listing_id"]
            entity_data = None
            if ltype == "service":
                entity_data = mongo.db.service_listings.find_one({"_id": lid})
                if entity_data:
                    worker = mongo.db.users.find_one({"_id": entity_data["worker_id"]})
                    entity_data["worker_name"] = worker.get("name") if worker else "Worker"
            elif ltype == "gig":
                entity_data = mongo.db.gigs.find_one({"_id": lid})
                if entity_data:
                    loc = mongo.db.localities.find_one({"_id": entity_data.get("work_locality_id")})
                    entity_data["locality_name"] = loc.get("name") if loc else ""
            elif ltype == "job":
                entity_data = mongo.db.jobs.find_one({"_id": lid})
                if entity_data:
                    loc = mongo.db.localities.find_one({"_id": entity_data.get("work_locality_id")})
                    entity_data["locality_name"] = loc.get("name") if loc else ""

            if entity_data:
                doc["listing_details"] = entity_data
                items.append(doc)

        return items
