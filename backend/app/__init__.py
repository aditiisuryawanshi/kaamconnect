from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.extensions import mongo
from app.common.errors import register_error_handlers

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Initialize MongoDB extension
    mongo.init_app(app)

    # Register error handlers
    register_error_handlers(app)

    # Register Blueprints
    from app.routes.auth import auth_bp
    from app.routes.meta import meta_bp
    from app.routes.workers import workers_bp
    from app.routes.services import services_bp
    from app.routes.bookings import bookings_bp
    from app.routes.gigs import gigs_bp
    from app.routes.jobs import jobs_bp
    from app.routes.applications import applications_bp
    from app.routes.employers import employers_bp
    from app.routes.saved import saved_bp
    from app.routes.reports import reports_bp
    from app.routes.notifications import notifications_bp
    from app.routes.admin import admin_bp

    app.register_blueprint(auth_bp, url_prefix="/api/v1/auth")
    app.register_blueprint(meta_bp, url_prefix="/api/v1/meta")
    app.register_blueprint(workers_bp, url_prefix="/api/v1/workers")
    app.register_blueprint(services_bp, url_prefix="/api/v1/services")
    app.register_blueprint(bookings_bp, url_prefix="/api/v1/bookings")
    app.register_blueprint(gigs_bp, url_prefix="/api/v1/gigs")
    app.register_blueprint(jobs_bp, url_prefix="/api/v1/jobs")
    app.register_blueprint(applications_bp, url_prefix="/api/v1/applications")
    app.register_blueprint(employers_bp, url_prefix="/api/v1/employer")
    app.register_blueprint(saved_bp, url_prefix="/api/v1/saved")
    app.register_blueprint(reports_bp, url_prefix="/api/v1/reports")
    app.register_blueprint(notifications_bp, url_prefix="/api/v1/notifications")
    app.register_blueprint(admin_bp, url_prefix="/api/v1/admin")

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return {"status": "ok", "app": "RozgaarSetu API", "version": "1.0.0"}

    return app
