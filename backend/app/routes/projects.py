from flask import Blueprint, jsonify

from app.models import Project

projects_bp = Blueprint("projects", __name__)


@projects_bp.get("")
def list_projects():
    projects = Project.query.order_by(Project.id).all()
    return jsonify([project.to_dict() for project in projects])
