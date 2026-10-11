from flask import Blueprint, request, g
from app.common.responses import success_response, paginated_response
from app.common.validators import validate_schema
from app.common.permissions import auth_required
from app.models.booking import BookingCreateSchema, BookingCancelSchema, BookingStatusUpdateSchema
from app.services.booking_service import BookingService

bookings_bp = Blueprint("bookings", __name__)

@bookings_bp.route("", methods=["POST"])
@auth_required
def create_booking():
    payload = request.get_json() or {}
    validated = validate_schema(BookingCreateSchema, payload)
    booking = BookingService.create_booking(str(g.current_user["_id"]), validated)
    return success_response(booking, message="Booking request submitted successfully", status_code=201)

@bookings_bp.route("/my", methods=["GET"])
@auth_required
def get_my_bookings():
    role = request.args.get("role", "customer") # "customer" or "worker"
    status = request.args.get("status")
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 20))

    user_id = str(g.current_user["_id"])
    if role == "worker":
        items, total = BookingService.list_worker_bookings(user_id, status=status, page=page, limit=limit)
    else:
        items, total = BookingService.list_customer_bookings(user_id, status=status, page=page, limit=limit)

    return paginated_response(items, total, page=page, limit=limit)

@bookings_bp.route("/<booking_id>", methods=["GET"])
@auth_required
def get_booking(booking_id):
    booking = BookingService.get_booking_details(booking_id, str(g.current_user["_id"]))
    return success_response(booking)

@bookings_bp.route("/<booking_id>/accept", methods=["POST"])
@auth_required
def accept_booking(booking_id):
    payload = request.get_json() or {}
    booking = BookingService.transition_status(
        booking_id=booking_id,
        actor_id=str(g.current_user["_id"]),
        target_status="confirmed",
        notes=payload.get("notes", "Booking confirmed by service provider")
    )
    return success_response(booking, message="Booking confirmed")

@bookings_bp.route("/<booking_id>/decline", methods=["POST"])
@auth_required
def decline_booking(booking_id):
    payload = request.get_json() or {}
    booking = BookingService.transition_status(
        booking_id=booking_id,
        actor_id=str(g.current_user["_id"]),
        target_status="declined",
        reason=payload.get("reason", "Declined by service provider")
    )
    return success_response(booking, message="Booking request declined")

@bookings_bp.route("/<booking_id>/start", methods=["POST"])
@auth_required
def start_booking(booking_id):
    payload = request.get_json() or {}
    booking = BookingService.transition_status(
        booking_id=booking_id,
        actor_id=str(g.current_user["_id"]),
        target_status="in_progress",
        notes=payload.get("notes", "Work started by service provider")
    )
    return success_response(booking, message="Booking marked in progress")

@bookings_bp.route("/<booking_id>/complete", methods=["POST"])
@auth_required
def complete_booking(booking_id):
    payload = request.get_json() or {}
    booking = BookingService.transition_status(
        booking_id=booking_id,
        actor_id=str(g.current_user["_id"]),
        target_status="completed",
        notes=payload.get("notes", "Service successfully completed")
    )
    return success_response(booking, message="Booking marked as completed")

@bookings_bp.route("/<booking_id>/cancel", methods=["POST"])
@auth_required
def cancel_booking(booking_id):
    payload = request.get_json() or {}
    validated = validate_schema(BookingCancelSchema, payload)
    booking = BookingService.transition_status(
        booking_id=booking_id,
        actor_id=str(g.current_user["_id"]),
        target_status="cancelled",
        reason=validated["reason"]
    )
    return success_response(booking, message="Booking cancelled successfully")
