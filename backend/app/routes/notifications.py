from flask import Blueprint, request, g
from app.common.responses import success_response
from app.common.permissions import auth_required
from app.services.notification_service import NotificationService

notifications_bp = Blueprint("notifications", __name__)

@notifications_bp.route("", methods=["GET"])
@auth_required
def get_notifications():
    limit = int(request.args.get("limit", 20))
    items, unread_count = NotificationService.list_user_notifications(str(g.current_user["_id"]), limit=limit)
    return success_response({"items": items, "unread_count": unread_count})

@notifications_bp.route("/<notification_id>/read", methods=["POST"])
@auth_required
def mark_notification_read(notification_id):
    NotificationService.mark_read(str(g.current_user["_id"]), notification_id)
    return success_response(message="Notification marked as read")

@notifications_bp.route("/read-all", methods=["POST"])
@auth_required
def mark_all_notifications_read():
    NotificationService.mark_all_read(str(g.current_user["_id"]))
    return success_response(message="All notifications marked as read")
