from flask import Blueprint, request, g
from app.extensions import mongo
from app.common.responses import success_response, paginated_response
from app.common.validators import validate_schema, parse_object_id
from app.common.permissions import roles_required
from app.models.report import ReportResolveSchema
from app.services.moderation_service import ModerationService

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/dashboard", methods=["GET"])
@roles_required("admin")
def get_admin_dashboard():
    metrics = ModerationService.get_admin_dashboard_metrics()
    return success_response(metrics)

@admin_bp.route("/users", methods=["GET"])
@roles_required("admin")
def list_users():
    role = request.args.get("role")
    status = request.args.get("status")
    keyword = request.args.get("keyword")
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 20))

    query = {}
    if role:
        query["roles"] = role
    if status:
        query["account_status"] = status
    if keyword:
        import re
        safe_kw = re.escape(keyword.strip())
        query["$or"] = [
            {"name": {"$regex": safe_kw, "$options": "i"}},
            {"email": {"$regex": safe_kw, "$options": "i"}}
        ]

    total = mongo.db.users.count_documents(query)
    cursor = mongo.db.users.find(query).sort("created_at", -1).skip((page - 1) * limit).limit(limit)

    users = []
    for u in cursor:
        u.pop("password_hash", None)
        users.append(u)

    return paginated_response(users, total, page=page, limit=limit)

@admin_bp.route("/users/<user_id>/status", methods=["PATCH"])
@roles_required("admin")
def update_user_status(user_id):
    uid = parse_object_id(user_id)
    payload = request.get_json() or {}
    new_status = payload.get("status")
    if new_status not in ["active", "suspended"]:
        return {"success": False, "error": "Invalid status"}, 400

    from datetime import datetime, timezone
    mongo.db.users.update_one({"_id": uid}, {"$set": {"account_status": new_status, "updated_at": datetime.now(timezone.utc)}})

    ModerationService.log_audit(
        actor_user_id=str(g.current_user["_id"]),
        action=f"update_user_status_to_{new_status}",
        target_type="user",
        target_id=user_id,
        metadata={"reason": payload.get("reason", "Admin action")}
    )

    return success_response(message=f"User status updated to '{new_status}'")

@admin_bp.route("/reports", methods=["GET"])
@roles_required("admin")
def list_reports():
    status = request.args.get("status", "pending")
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 20))
    items, total = ModerationService.list_reports(status=status, page=page, limit=limit)
    return paginated_response(items, total, page=page, limit=limit)

@admin_bp.route("/reports/<report_id>/resolve", methods=["POST"])
@roles_required("admin")
def resolve_report(report_id):
    payload = request.get_json() or {}
    validated = validate_schema(ReportResolveSchema, payload)
    report = ModerationService.resolve_report(
        report_id=report_id,
        admin_user_id=str(g.current_user["_id"]),
        resolution=validated["resolution"],
        notes=validated["resolution_notes"]
    )
    return success_response(report, message="Report resolved successfully")

@admin_bp.route("/audit-logs", methods=["GET"])
@roles_required("admin")
def list_audit_logs():
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 20))
    total = mongo.db.audit_logs.count_documents({})
    cursor = mongo.db.audit_logs.find({}).sort("created_at", -1).skip((page - 1) * limit).limit(limit)
    items = list(cursor)
    for log in items:
        actor = mongo.db.users.find_one({"_id": log["actor_user_id"]})
        log["actor_name"] = actor.get("name") if actor else "System"
    return paginated_response(items, total, page=page, limit=limit)
