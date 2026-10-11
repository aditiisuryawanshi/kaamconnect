from flask import Blueprint, request, g
from app.common.responses import success_response
from app.common.validators import validate_schema
from app.common.permissions import auth_required, roles_required
from app.models.worker import WorkerOnboardingSchema, WorkerProfileUpdateSchema
from app.services.worker_service import WorkerService

workers_bp = Blueprint("workers", __name__)

@workers_bp.route("/me", methods=["GET"])
@auth_required
def get_my_worker_profile():
    profile = WorkerService.get_profile(str(g.current_user["_id"]))
    return success_response(profile)

@workers_bp.route("/me", methods=["PATCH"])
@auth_required
def update_my_worker_profile():
    payload = request.get_json() or {}
    validated = validate_schema(WorkerProfileUpdateSchema, payload)
    profile = WorkerService.update_profile(str(g.current_user["_id"]), validated)
    return success_response(profile, message="Profile updated successfully")

@workers_bp.route("/onboarding", methods=["POST"])
@auth_required
def complete_onboarding():
    payload = request.get_json() or {}
    validated = validate_schema(WorkerOnboardingSchema, payload)
    profile = WorkerService.complete_onboarding(str(g.current_user["_id"]), validated)
    return success_response(profile, message="Worker onboarding completed successfully")

@workers_bp.route("/<worker_id>", methods=["GET"])
def get_worker_public(worker_id):
    profile = WorkerService.get_public_provider_profile(worker_id)
    return success_response(profile)

@workers_bp.route("/providers/<provider_id>", methods=["GET"])
def get_provider_profile(provider_id):
    profile = WorkerService.get_public_provider_profile(provider_id)
    return success_response(profile)
