from flask import Blueprint, jsonify

from app.models import Collection

collections_bp = Blueprint("collections", __name__)


@collections_bp.get("")
def list_collections():
    collections = Collection.query.order_by(Collection.id).all()
    return jsonify([collection.to_dict() for collection in collections])
