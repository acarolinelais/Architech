from flask import Blueprint, jsonify

from app.models import ContactLink

contact_bp = Blueprint("contact", __name__)


@contact_bp.get("")
def list_contact_links():
    links = ContactLink.query.order_by(ContactLink.id).all()
    return jsonify([link.to_dict() for link in links])
