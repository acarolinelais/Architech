import os

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

load_dotenv()

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL", "sqlite:///architech.db"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "change-me")

    db.init_app(app)

    cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    CORS(app, resources={r"/api/*": {"origins": cors_origins}})

    from app.routes.posts import posts_bp
    from app.routes.tags import tags_bp
    from app.routes.profile import profile_bp
    from app.routes.projects import projects_bp
    from app.routes.contact import contact_bp

    app.register_blueprint(posts_bp, url_prefix="/api/posts")
    app.register_blueprint(tags_bp, url_prefix="/api/tags")
    app.register_blueprint(profile_bp, url_prefix="/api/profile")
    app.register_blueprint(projects_bp, url_prefix="/api/projects")
    app.register_blueprint(contact_bp, url_prefix="/api/contact")

    @app.get("/api/health")
    def health():
        return {"status": "ok"}

    from app import seed

    app.cli.add_command(seed.seed_db_command)

    return app
