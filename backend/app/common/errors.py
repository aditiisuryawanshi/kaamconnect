from flask import jsonify

class AppError(Exception):
    def __init__(self, message="An error occurred", status_code=400, payload=None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['success'] = False
        rv['error'] = self.message
        return rv

class BadRequestError(AppError):
    def __init__(self, message="Bad request", payload=None):
        super().__init__(message, status_code=400, payload=payload)

class UnauthorizedError(AppError):
    def __init__(self, message="Authentication required", payload=None):
        super().__init__(message, status_code=401, payload=payload)

class ForbiddenError(AppError):
    def __init__(self, message="You do not have permission to perform this action", payload=None):
        super().__init__(message, status_code=403, payload=payload)

class NotFoundError(AppError):
    def __init__(self, message="Resource not found", payload=None):
        super().__init__(message, status_code=404, payload=payload)

class ConflictError(AppError):
    def __init__(self, message="Resource conflict or duplicate detected", payload=None):
        super().__init__(message, status_code=409, payload=payload)

class ValidationError(AppError):
    def __init__(self, message="Validation error", errors=None):
        payload = {"validation_errors": errors} if errors else None
        super().__init__(message, status_code=422, payload=payload)

def register_error_handlers(app):
    @app.errorhandler(AppError)
    def handle_app_error(error):
        response = jsonify(error.to_dict())
        response.status_code = error.status_code
        return response

    @app.errorhandler(400)
    def handle_400(error):
        return jsonify({"success": False, "error": "Bad request"}), 400

    @app.errorhandler(404)
    def handle_404(error):
        return jsonify({"success": False, "error": "Route or resource not found"}), 404

    @app.errorhandler(405)
    def handle_405(error):
        return jsonify({"success": False, "error": "Method not allowed"}), 405

    @app.errorhandler(500)
    def handle_500(error):
        app.logger.error(f"Internal server error: {error}")
        return jsonify({"success": False, "error": "An internal server error occurred"}), 500
