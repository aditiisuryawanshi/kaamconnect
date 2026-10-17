from flask import Blueprint, request, g
from app.common.responses import success_response, paginated_response
from app.common.validators import validate_schema
from app.common.permissions import auth_required, optional_auth, roles_required
from app.models.gig import GigCreateSchema, GigUpdateSchema
from app.services.gig_service import GigService

gigs_bp = Blueprint("gigs", __name__)

@gigs_bp.route("", methods=["GET"])
def list_gigs():
    locality_id = request.args.get("locality")
    category_slug = request.args.get("category")
    keyword = request.args.get("keyword")
    role = request.args.get("role")
    min_pay = request.args.get("min_pay")
    max_pay = request.args.get("max_pay")
    sort_by = request.args.get("sort", "newest")
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 12))

    items, total = GigService.list_gigs(
        locality_id=locality_id,
        category_slug=category_slug,
        keyword=keyword,
        role=role,
        min_pay=min_pay,
        max_pay=max_pay,
        sort_by=sort_by,
        page=page,
        limit=limit
    )
    return paginated_response(items, total, page=page, limit=limit)

@gigs_bp.route("/my", methods=["GET"])
@roles_required("employer")
def get_my_gigs():
    items = GigService.get_my_gigs(str(g.current_user["_id"]))
    return success_response(items)

@gigs_bp.route("/<gig_id>", methods=["GET"])
@optional_auth
def get_gig_details(gig_id):
    current_uid = str(g.current_user["_id"]) if g.current_user else None
    item = GigService.get_by_id(gig_id, current_uid)
    return success_response(item)

@gigs_bp.route("", methods=["POST"])
@roles_required("employer")
def create_gig():
    payload = request.get_json() or {}
    validated = validate_schema(GigCreateSchema, payload)
    item = GigService.create(str(g.current_user["_id"]), validated)
    return success_response(item, message="Gig posted successfully", status_code=201)

@gigs_bp.route("/<gig_id>", methods=["PATCH"])
@roles_required("employer")
def update_gig(gig_id):
    payload = request.get_json() or {}
    validated = validate_schema(GigUpdateSchema, payload)
    item = GigService.update(gig_id, str(g.current_user["_id"]), validated)
    return success_response(item, message="Gig updated successfully")

@gigs_bp.route("/<gig_id>/publish", methods=["POST"])
@roles_required("employer")
def publish_gig(gig_id):
    item = GigService.set_status(gig_id, str(g.current_user["_id"]), "published")
    return success_response(item, message="Gig listing published")

@gigs_bp.route("/<gig_id>/close", methods=["POST"])
@roles_required("employer")
def close_gig(gig_id):
    item = GigService.set_status(gig_id, str(g.current_user["_id"]), "closed")
    return success_response(item, message="Gig listing closed")
