from flask import Blueprint, request, g
from app.common.responses import success_response
from app.common.permissions import auth_required
from app.services.saved_service import SavedService

saved_bp = Blueprint("saved", __name__)

@saved_bp.route("", methods=["GET"])
@auth_required
def get_saved_listings():
    listing_type = request.args.get("type")
    items = SavedService.list_saved(str(g.current_user["_id"]), listing_type=listing_type)
    return success_response(items)

@saved_bp.route("/toggle", methods=["POST"])
@auth_required
def toggle_save():
    payload = request.get_json() or {}
    listing_type = payload.get("listing_type")
    listing_id = payload.get("listing_id")
    result = SavedService.toggle_save(str(g.current_user["_id"]), listing_type, listing_id)
    msg = "Saved to bookmarks" if result["saved"] else "Removed from bookmarks"
    return success_response(result, message=msg)
