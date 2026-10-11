from flask import Blueprint, request, g
from app.common.responses import success_response
from app.common.validators import validate_schema
from app.common.permissions import auth_required, roles_required
from app.models.employer import EmployerUpdateSchema
from app.services.employer_service import EmployerService

employers_bp = Blueprint("employers", __name__)

@employers_bp.route("/profile", methods=["GET"])
@roles_required("employer")
def get_employer_profile():
    profile = EmployerService.get_profile(str(g.current_user["_id"]))
    return success_response(profile)

@employers_bp.route("/profile", methods=["PATCH"])
@roles_required("employer")
def update_employer_profile():
    payload = request.get_json() or {}
    validated = validate_schema(EmployerUpdateSchema, payload)
    profile = EmployerService.update_profile(str(g.current_user["_id"]), validated)
    return success_response(profile, message="Employer profile updated successfully")

@employers_bp.route("/dashboard", methods=["GET"])
@roles_required("employer")
def get_employer_dashboard():
    data = EmployerService.get_dashboard(str(g.current_user["_id"]))
    return success_response(data)
