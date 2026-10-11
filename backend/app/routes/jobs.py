from flask import Blueprint, request, g
from app.common.responses import success_response, paginated_response
from app.common.validators import validate_schema
from app.common.permissions import auth_required, optional_auth, roles_required
from app.models.job import JobCreateSchema, JobUpdateSchema
from app.services.job_service import JobService

jobs_bp = Blueprint("jobs", __name__)

@jobs_bp.route("", methods=["GET"])
def list_jobs():
    locality_id = request.args.get("locality")
    employment_type = request.args.get("employment_type")
    pay_period = request.args.get("pay_period")
    keyword = request.args.get("keyword")
    min_salary = request.args.get("min_salary")
    sort_by = request.args.get("sort", "newest")
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 12))

    items, total = JobService.list_jobs(
        locality_id=locality_id,
        employment_type=employment_type,
        pay_period=pay_period,
        keyword=keyword,
        min_salary=min_salary,
        sort_by=sort_by,
        page=page,
        limit=limit
    )
    return paginated_response(items, total, page=page, limit=limit)

@jobs_bp.route("/my", methods=["GET"])
@roles_required("employer")
def get_my_jobs():
    items = JobService.get_my_jobs(str(g.current_user["_id"]))
    return success_response(items)

@jobs_bp.route("/<job_id>", methods=["GET"])
@optional_auth
def get_job_details(job_id):
    current_uid = str(g.current_user["_id"]) if g.current_user else None
    item = JobService.get_by_id(job_id, current_uid)
    return success_response(item)

@jobs_bp.route("", methods=["POST"])
@roles_required("employer")
def create_job():
    payload = request.get_json() or {}
    validated = validate_schema(JobCreateSchema, payload)
    item = JobService.create(str(g.current_user["_id"]), validated)
    return success_response(item, message="Job vacancy posted successfully", status_code=201)

@jobs_bp.route("/<job_id>", methods=["PATCH"])
@roles_required("employer")
def update_job(job_id):
    payload = request.get_json() or {}
    validated = validate_schema(JobUpdateSchema, payload)
    item = JobService.update(job_id, str(g.current_user["_id"]), validated)
    return success_response(item, message="Job vacancy updated successfully")

@jobs_bp.route("/<job_id>/publish", methods=["POST"])
@roles_required("employer")
def publish_job(job_id):
    item = JobService.set_status(job_id, str(g.current_user["_id"]), "published")
    return success_response(item, message="Job vacancy published")

@jobs_bp.route("/<job_id>/close", methods=["POST"])
@roles_required("employer")
def close_job(job_id):
    item = JobService.set_status(job_id, str(g.current_user["_id"]), "closed")
    return success_response(item, message="Job vacancy closed")
