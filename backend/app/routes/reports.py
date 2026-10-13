from flask import Blueprint, request, g
from app.common.responses import success_response
from app.common.validators import validate_schema
from app.common.permissions import auth_required
from app.models.report import ReportCreateSchema
from app.services.moderation_service import ModerationService

reports_bp = Blueprint("reports", __name__)

@reports_bp.route("", methods=["POST"])
@auth_required
def create_report():
    payload = request.get_json() or {}
    validated = validate_schema(ReportCreateSchema, payload)
    report = ModerationService.create_report(str(g.current_user["_id"]), validated)
    return success_response(report, message="Report submitted for platform review. Thank you for keeping RozgaarSetu safe.", status_code=201)
