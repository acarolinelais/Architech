from flask import Blueprint, abort, jsonify

from app.models import Profile

profile_bp = Blueprint("profile", __name__)


@profile_bp.get("")
def get_profile():
    profile = Profile.query.first()
    if profile is None:
        abort(404, description="Profile not seeded yet")
    return jsonify(profile.to_dict())
