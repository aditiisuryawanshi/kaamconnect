import os
from app import create_app
from app.database.indexes import init_indexes
from app.extensions import mongo

app = create_app()

with app.app_context():
    try:
        init_indexes(mongo.db)
        app.logger.info("MongoDB indexes successfully initialized.")
    except Exception as e:
        app.logger.warning(f"Could not initialize indexes: {e}")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
