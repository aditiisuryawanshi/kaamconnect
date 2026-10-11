import re
from bson import ObjectId
from app.common.errors import BadRequestError, ValidationError

EMAIL_REGEX = re.compile(r"^[\w\.-]+@[\w\.-]+\.\w+$")
PHONE_REGEX = re.compile(r"^\+?[0-9]{10,14}$")

def parse_object_id(oid_str, param_name="id") -> ObjectId:
    if not oid_str:
        raise BadRequestError(f"{param_name} is required")
    try:
        return ObjectId(oid_str)
    except Exception:
        raise BadRequestError(f"Invalid {param_name} format: '{oid_str}' is not a valid ObjectId")

def normalize_email(email: str) -> str:
    if not email:
        return ""
    return email.strip().lower()

def normalize_phone(phone: str) -> str:
    if not phone:
        return ""
    # Strip spaces, hyphens, and parenthesis
    cleaned = re.sub(r"[\s\-\(\)]", "", phone.strip())
    # If 10 digits without country code, add +91 for Mumbai/India standard
    if len(cleaned) == 10 and cleaned.isdigit():
        cleaned = "+91" + cleaned
    return cleaned

def validate_schema(pydantic_model, data):
    try:
        validated = pydantic_model(**data)
        return validated.model_dump()
    except Exception as e:
        if hasattr(e, "errors"):
            errors = [{"loc": ".".join(str(i) for i in err.get("loc", [])), "msg": err.get("msg")} for err in e.errors()]
            raise ValidationError("Validation failed", errors=errors)
        raise ValidationError(str(e))
