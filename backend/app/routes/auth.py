from flask import Blueprint, request, g
from app.common.responses import success_response
from app.common.validators import validate_schema
from app.common.permissions import auth_required
from app.models.user import UserRegisterSchema, UserLoginSchema, RoleAddSchema
from app.services.auth_service import AuthService

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    payload = request.get_json() or {}
    validated = validate_schema(UserRegisterSchema, payload)
    result = AuthService.register(validated)
    return success_response(result, message="Registration successful", status_code=201)

@auth_bp.route("/login", methods=["POST"])
def login():
    payload = request.get_json() or {}
    validated = validate_schema(UserLoginSchema, payload)
    result = AuthService.login(validated)
    return success_response(result, message="Login successful")

@auth_bp.route("/me", methods=["GET"])
@auth_required
def get_me():
    user = AuthService.get_me(g.current_user)
    return success_response(user)

@auth_bp.route("/roles", methods=["POST"])
@auth_required
def add_role():
    payload = request.get_json() or {}
    validated = validate_schema(RoleAddSchema, payload)
    result = AuthService.add_role(g.current_user, validated["role"])
    return success_response(result, message=f"Role '{validated['role']}' added successfully")
