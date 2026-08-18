from flask import Blueprint, jsonify

from app.models import Category

tags_bp = Blueprint("tags", __name__)


@tags_bp.get("")
def list_tags():
    categories = Category.query.order_by(Category.name).all()
    return jsonify([category.to_dict_with_tags() for category in categories])
