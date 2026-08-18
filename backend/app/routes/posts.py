from flask import Blueprint, abort, jsonify, request
from sqlalchemy import or_

from app.models import Post

posts_bp = Blueprint("posts", __name__)


@posts_bp.get("")
def list_posts():
    query = Post.query

    keyword = request.args.get("q", "").strip()
    if keyword:
        like = f"%{keyword}%"
        query = query.filter(
            or_(
                Post.title.ilike(like),
                Post.excerpt.ilike(like),
            )
        )

    category = request.args.get("category", "").strip()
    if category and category.lower() != "all":
        query = query.join(Post.category).filter_by(slug=category)

    tag = request.args.get("tag", "").strip()
    if tag:
        query = query.join(Post.tags).filter_by(slug=tag)

    sort = request.args.get("sort", "desc").lower()
    order = Post.published_at.asc() if sort == "asc" else Post.published_at.desc()
    query = query.order_by(order)

    posts = query.distinct().all()
    return jsonify([post.to_summary_dict() for post in posts])


@posts_bp.get("/<slug>")
def get_post(slug):
    post = Post.query.filter_by(slug=slug).first()
    if post is None:
        abort(404, description="Post not found")
    return jsonify(post.to_detail_dict())
