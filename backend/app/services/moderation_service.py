from datetime import datetime, timezone
from bson import ObjectId
from app.extensions import mongo
from app.common.errors import NotFoundError, BadRequestError, ForbiddenError
from app.common.validators import parse_object_id

class ModerationService:
    @staticmethod
    def log_audit(actor_user_id: str, action: str, target_type: str, target_id: str, metadata=None):
        try:
            aid = parse_object_id(actor_user_id)
            now = datetime.now(timezone.utc)
            mongo.db.audit_logs.insert_one({
                "actor_user_id": aid,
                "action": action,
                "target_type": target_type,
                "target_id": str(target_id),
                "metadata": metadata or {},
                "created_at": now
            })
        except Exception:
            pass

    @staticmethod
    def create_report(reporter_user_id: str, data: dict) -> dict:
        rid = parse_object_id(reporter_user_id)
        target_type = data["target_type"]
        tid = parse_object_id(data["target_id"])

        now = datetime.now(timezone.utc)
        doc = {
            "reporter_id": rid,
            "target_type": target_type,
            "target_id": tid,
            "reason": data["reason"].strip(),
            "description": data["description"].strip(),
            "status": "pending",
            "assigned_admin_id": None,
            "resolution": None,
            "resolution_notes": None,
            "created_at": now,
            "updated_at": now
        }
        res = mongo.db.reports.insert_one(doc)
        doc["_id"] = res.inserted_id
        return doc

    @staticmethod
    def list_reports(status="pending", page=1, limit=20):
        query = {}
        if status:
            query["status"] = status
        total = mongo.db.reports.count_documents(query)
        cursor = mongo.db.reports.find(query).sort("created_at", -1).skip((page - 1) * limit).limit(limit)
        items = list(cursor)
        for item in items:
            reporter = mongo.db.users.find_one({"_id": item["reporter_id"]})
            item["reporter_name"] = reporter.get("name") if reporter else "User"
        return items, total

    @staticmethod
    def resolve_report(report_id: str, admin_user_id: str, resolution: str, notes: str) -> dict:
        rep_id = parse_object_id(report_id)
        aid = parse_object_id(admin_user_id)

        report = mongo.db.reports.find_one({"_id": rep_id})
        if not report:
            raise NotFoundError("Report not found")

        now = datetime.now(timezone.utc)

        # Apply action according to resolution
        if resolution == "content_removed":
            ttype = report["target_type"]
            tid = report["target_id"]
            if ttype == "service":
                mongo.db.service_listings.update_one({"_id": tid}, {"$set": {"status": "archived", "moderation_status": "rejected"}})
            elif ttype == "gig":
                mongo.db.gigs.update_one({"_id": tid}, {"$set": {"status": "closed", "moderation_status": "rejected"}})
            elif ttype == "job":
                mongo.db.jobs.update_one({"_id": tid}, {"$set": {"status": "closed", "moderation_status": "rejected"}})
        elif resolution == "user_suspended":
            # If target is user or owner of listing
            tid = report["target_id"]
            mongo.db.users.update_one({"_id": tid}, {"$set": {"account_status": "suspended"}})

        mongo.db.reports.update_one({"_id": rep_id}, {
            "$set": {
                "status": "resolved",
                "assigned_admin_id": aid,
                "resolution": resolution,
                "resolution_notes": notes,
                "updated_at": now
            }
        })

        ModerationService.log_audit(
            actor_user_id=admin_user_id,
            action="resolve_report",
            target_type=report["target_type"],
            target_id=str(report["target_id"]),
            metadata={"resolution": resolution, "report_id": str(rep_id)}
        )

        return mongo.db.reports.find_one({"_id": rep_id})

    @staticmethod
    def get_admin_dashboard_metrics():
        total_users = mongo.db.users.count_documents({})
        workers_count = mongo.db.users.count_documents({"roles": "worker"})
        employers_count = mongo.db.users.count_documents({"roles": "employer"})
        customers_count = mongo.db.users.count_documents({"roles": "customer"})
        
        services_count = mongo.db.service_listings.count_documents({"status": "published"})
        gigs_count = mongo.db.gigs.count_documents({"status": "published"})
        jobs_count = mongo.db.jobs.count_documents({"status": "published"})
        
        active_bookings = mongo.db.bookings.count_documents({"status": {"$in": ["requested", "confirmed", "in_progress"]}})
        total_bookings = mongo.db.bookings.count_documents({})
        pending_reports = mongo.db.reports.count_documents({"status": "pending"})

        # Recent audit logs
        recent_logs = list(mongo.db.audit_logs.find({}).sort("created_at", -1).limit(10))
        for log in recent_logs:
            actor = mongo.db.users.find_one({"_id": log["actor_user_id"]})
            log["actor_name"] = actor.get("name") if actor else "System"

        return {
            "total_users": total_users,
            "workers_count": workers_count,
            "employers_count": employers_count,
            "customers_count": customers_count,
            "services_count": services_count,
            "gigs_count": gigs_count,
            "jobs_count": jobs_count,
            "active_bookings": active_bookings,
            "total_bookings": total_bookings,
            "pending_reports": pending_reports,
            "recent_audit_logs": recent_logs
        }
