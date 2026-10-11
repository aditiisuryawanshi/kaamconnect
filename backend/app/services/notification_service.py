from datetime import datetime, timezone
from bson import ObjectId
from app.extensions import mongo
from app.common.validators import parse_object_id

class NotificationService:
    @staticmethod
    def notify(recipient_user_id: str, event_type: str, title: str, message: str, resource_type=None, resource_id=None):
        if not recipient_user_id:
            return None
        try:
            uid = parse_object_id(recipient_user_id)
            now = datetime.now(timezone.utc)
            doc = {
                "recipient_user_id": uid,
                "event_type": event_type,
                "title": title,
                "message": message,
                "resource_type": resource_type,
                "resource_id": str(resource_id) if resource_id else None,
                "read_at": None,
                "created_at": now
            }
            res = mongo.db.notifications.insert_one(doc)
            doc["_id"] = res.inserted_id
            return doc
        except Exception:
            return None

    @staticmethod
    def list_user_notifications(user_id: str, limit=20):
        uid = parse_object_id(user_id)
        cursor = mongo.db.notifications.find({"recipient_user_id": uid}).sort("created_at", -1).limit(limit)
        items = list(cursor)
        unread_count = mongo.db.notifications.count_documents({"recipient_user_id": uid, "read_at": None})
        return items, unread_count

    @staticmethod
    def mark_read(user_id: str, notification_id: str):
        uid = parse_object_id(user_id)
        nid = parse_object_id(notification_id)
        now = datetime.now(timezone.utc)
        mongo.db.notifications.update_one(
            {"_id": nid, "recipient_user_id": uid},
            {"$set": {"read_at": now}}
        )
        return True

    @staticmethod
    def mark_all_read(user_id: str):
        uid = parse_object_id(user_id)
        now = datetime.now(timezone.utc)
        mongo.db.notifications.update_many(
            {"recipient_user_id": uid, "read_at": None},
            {"$set": {"read_at": now}}
        )
        return True
