from flask import Blueprint
from app.extensions import mongo
from app.common.responses import success_response

meta_bp = Blueprint("meta", __name__)

@meta_bp.route("/localities", methods=["GET"])
def get_localities():
    localities = list(mongo.db.localities.find({"active": True}).sort("name", 1))
    return success_response(localities)

@meta_bp.route("/categories", methods=["GET"])
def get_categories():
    categories = list(mongo.db.service_categories.find({"active": True}).sort("sort_order", 1))
    return success_response(categories)
