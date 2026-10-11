from datetime import datetime
from bson import ObjectId
from flask import jsonify

def serialize_mongo(obj):
    """
    Recursively converts MongoDB BSON objects (ObjectId, datetime) to JSON-serializable types.
    """
    if isinstance(obj, list):
        return [serialize_mongo(item) for item in obj]
    elif isinstance(obj, dict):
        result = {}
        for k, v in obj.items():
            if k == "_id":
                result["id"] = str(v)
            elif isinstance(v, ObjectId):
                result[k] = str(v)
            elif isinstance(v, datetime):
                result[k] = v.isoformat()
            elif isinstance(v, (dict, list)):
                result[k] = serialize_mongo(v)
            else:
                result[k] = v
        return result
    elif isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, datetime):
        return obj.isoformat()
    return obj

def success_response(data=None, message=None, status_code=200):
    payload = {"success": True}
    if message is not None:
        payload["message"] = message
    if data is not None:
        payload["data"] = serialize_mongo(data)
    return jsonify(payload), status_code

def paginated_response(items, total, page=1, limit=20, message=None, extra=None):
    payload = {
        "success": True,
        "data": serialize_mongo(items),
        "pagination": {
            "total": total,
            "page": page,
            "limit": limit,
            "pages": (total + limit - 1) // limit if limit > 0 else 1
        }
    }
    if message:
        payload["message"] = message
    if extra:
        payload.update(extra)
    return jsonify(payload), 200
