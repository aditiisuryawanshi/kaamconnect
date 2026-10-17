from flask import Blueprint, request, g
from app.common.responses import success_response, paginated_response
from app.common.validators import validate_schema
from app.common.permissions import auth_required, roles_required
from app.models.service_listing import ServiceListingCreateSchema, ServiceListingUpdateSchema
from app.services.service_listing_service import ServiceListingService

services_bp = Blueprint("services", __name__)

@services_bp.route("", methods=["GET"])
def list_services():
    category_slug = request.args.get("category")
    locality_id = request.args.get("locality")
    keyword = request.args.get("keyword")
    min_price = request.args.get("min_price")
    max_price = request.args.get("max_price")
    sort_by = request.args.get("sort", "newest")
    try:
        page = max(1, int(request.args.get("page", 1)))
    except (ValueError, TypeError):
        page = 1
    try:
        limit = max(1, min(100, int(request.args.get("limit", 12))))
    except (ValueError, TypeError):
        limit = 12

    items, total = ServiceListingService.list_services(
        category_slug=category_slug,
        locality_id=locality_id,
        keyword=keyword,
        min_price=min_price,
        max_price=max_price,
        sort_by=sort_by,
        page=page,
        limit=limit
    )
    return paginated_response(items, total, page=page, limit=limit)

@services_bp.route("/my", methods=["GET"])
@auth_required
def get_my_services():
    items = ServiceListingService.get_my_services(str(g.current_user["_id"]))
    return success_response(items)

@services_bp.route("/<service_id>", methods=["GET"])
def get_service_details(service_id):
    item = ServiceListingService.get_by_id(service_id)
    return success_response(item)

@services_bp.route("", methods=["POST"])
@roles_required("worker")
def create_service():
    payload = request.get_json() or {}
    validated = validate_schema(ServiceListingCreateSchema, payload)
    item = ServiceListingService.create(str(g.current_user["_id"]), validated)
    return success_response(item, message="Service listing created successfully", status_code=201)

@services_bp.route("/<service_id>", methods=["PATCH"])
@roles_required("worker")
def update_service(service_id):
    payload = request.get_json() or {}
    validated = validate_schema(ServiceListingUpdateSchema, payload)
    item = ServiceListingService.update(service_id, str(g.current_user["_id"]), validated)
    return success_response(item, message="Service listing updated successfully")

@services_bp.route("/<service_id>/publish", methods=["POST"])
@roles_required("worker")
def publish_service(service_id):
    item = ServiceListingService.set_status(service_id, str(g.current_user["_id"]), "published")
    return success_response(item, message="Service listing published")

@services_bp.route("/<service_id>/pause", methods=["POST"])
@roles_required("worker")
def pause_service(service_id):
    item = ServiceListingService.set_status(service_id, str(g.current_user["_id"]), "paused")
    return success_response(item, message="Service listing paused")
