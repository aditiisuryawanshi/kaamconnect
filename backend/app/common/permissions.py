from functools import wraps
from datetime import datetime, timezone, timedelta
import jwt
from flask import request, current_app, g
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId
from app.common.errors import UnauthorizedError, ForbiddenError
from app.extensions import mongo

def hash_password(password: str) -> str:
    return generate_password_hash(password, method='scrypt')

def verify_password(password: str, hashed: str) -> bool:
    return check_password_hash(hashed, password)

def generate_token(user_id: str, email: str, roles: list) -> str:
    payload = {
        "sub": str(user_id),
        "email": email,
        "roles": roles,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(days=7)
    }
    secret = current_app.config["JWT_SECRET_KEY"]
    return jwt.encode(payload, secret, algorithm="HS256")

def decode_token(token: str) -> dict:
    try:
        secret = current_app.config["JWT_SECRET_KEY"]
        return jwt.decode(token, secret, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise UnauthorizedError("Token has expired. Please log in again.")
    except jwt.InvalidTokenError:
        raise UnauthorizedError("Invalid authentication token.")

def auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise UnauthorizedError("Authorization header with Bearer token is required")
        
        token = auth_header.split(" ")[1]
        decoded = decode_token(token)
        
        # Verify user still exists and is active in database
        user_id = decoded.get("sub")
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise UnauthorizedError("User associated with token no longer exists")
        
        if user.get("account_status") == "suspended":
            raise ForbiddenError("Your account has been suspended. Please contact platform support.")

        g.current_user = user
        g.token_data = decoded
        return f(*args, **kwargs)
    return decorated

def optional_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if auth_header and auth_header.startswith("Bearer "):
            try:
                token = auth_header.split(" ")[1]
                decoded = decode_token(token)
                user_id = decoded.get("sub")
                user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
                if user and user.get("account_status") != "suspended":
                    g.current_user = user
                    g.token_data = decoded
            except Exception:
                g.current_user = None
        else:
            g.current_user = None
        return f(*args, **kwargs)
    return decorated

def roles_required(*allowed_roles):
    def decorator(f):
        @wraps(f)
        @auth_required
        def decorated(*args, **kwargs):
            user = g.current_user
            user_roles = user.get("roles", [])
            # If user has admin role, admin has access to everything
            if "admin" in user_roles:
                return f(*args, **kwargs)
            # Check if user has any of the required roles
            if not any(role in user_roles for role in allowed_roles):
                raise ForbiddenError(f"Action requires one of the following roles: {', '.join(allowed_roles)}")
            return f(*args, **kwargs)
        return decorated
    return decorator
