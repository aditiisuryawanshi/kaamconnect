from flask import Blueprint, request, g
from app.common.responses import success_response, paginated_response
from app.common.validators import validate_schema
from app.common.permissions import auth_required, roles_required
from app.models.application import ApplicationSubmitSchema, ApplicationStatusActionSchema
from app.services.application_service import ApplicationService

applications_bp = Blueprint("applications", __name__)

@applications_bp.route("", methods=["POST"])
@auth_required
def apply_opportunity():
    payload = request.get_json() or {}
    validated = validate_schema(ApplicationSubmitSchema, payload)
    app = ApplicationService.apply(str(g.current_user["_id"]), validated)
    return success_response(app, message="Application submitted successfully", status_code=201)

@applications_bp.route("/my", methods=["GET"])
@auth_required
def get_my_applications():
    listing_type = request.args.get("type")
    status = request.args.get("status")
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 20))

    items, total = ApplicationService.list_my_applications(
        worker_user_id=str(g.current_user["_id"]),
        listing_type=listing_type,
        status=status,
        page=page,
        limit=limit
    )
    return paginated_response(items, total, page=page, limit=limit)

@applications_bp.route("/<application_id>", methods=["GET"])
@auth_required
def get_application_details(application_id):
    app = ApplicationService.get_application_details(application_id, str(g.current_user["_id"]))
    return success_response(app)

@applications_bp.route("/<application_id>/withdraw", methods=["POST"])
@auth_required
def withdraw_application(application_id):
    app = ApplicationService.withdraw(application_id, str(g.current_user["_id"]))
    return success_response(app, message="Application withdrawn")

# Employer applicant endpoints
@applications_bp.route("/employer", methods=["GET"])
@roles_required("employer")
def get_employer_applicants():
    listing_type = request.args.get("type")
    listing_id = request.args.get("listing_id")
    status = request.args.get("status")
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 20))

    items, total = ApplicationService.list_employer_applicants(
        employer_user_id=str(g.current_user["_id"]),
        listing_type=listing_type,
        listing_id=listing_id,
        status=status,
        page=page,
        limit=limit
    )
    return paginated_response(items, total, page=page, limit=limit)

@applications_bp.route("/<application_id>/shortlist", methods=["POST"])
@roles_required("employer")
def shortlist_candidate(application_id):
    payload = request.get_json() or {}
    app = ApplicationService.employer_update_status(
        application_id=application_id,
        employer_user_id=str(g.current_user["_id"]),
        target_status="shortlisted",
        notes=payload.get("employer_notes")
    )
    return success_response(app, message="Candidate shortlisted")

@applications_bp.route("/<application_id>/select", methods=["POST"])
@roles_required("employer")
def select_candidate(application_id):
    payload = request.get_json() or {}
    app = ApplicationService.employer_update_status(
        application_id=application_id,
        employer_user_id=str(g.current_user["_id"]),
        target_status="selected",
        notes=payload.get("employer_notes")
    )
    return success_response(app, message="Candidate selected for offer/hire")

@applications_bp.route("/<application_id>/reject", methods=["POST"])
@roles_required("employer")
def reject_candidate(application_id):
    payload = request.get_json() or {}
    app = ApplicationService.employer_update_status(
        application_id=application_id,
        employer_user_id=str(g.current_user["_id"]),
        target_status="rejected",
        notes=payload.get("employer_notes"),
        reason=payload.get("reason")
    )
    return success_response(app, message="Application rejected")
