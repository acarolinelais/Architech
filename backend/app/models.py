from datetime import date

from app import db

post_tags = db.Table(
    "post_tags",
    db.Column("post_id", db.Integer, db.ForeignKey("post.id"), primary_key=True),
    db.Column("tag_id", db.Integer, db.ForeignKey("tag.id"), primary_key=True),
)

collection_posts = db.Table(
    "collection_posts",
    db.Column("collection_id", db.Integer, db.ForeignKey("collection.id"), primary_key=True),
    db.Column("post_id", db.Integer, db.ForeignKey("post.id"), primary_key=True),
)


class Category(db.Model):
    """Top-level grouping used both as a post's badge and as the tags sidebar section."""

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    slug = db.Column(db.String(50), unique=True, nullable=False)
    color = db.Column(db.String(20), nullable=False)  # e.g. "indigo", "pink"

    tags = db.relationship("Tag", back_populates="category", order_by="Tag.name")
    posts = db.relationship("Post", back_populates="category")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "color": self.color,
        }

    def to_dict_with_tags(self):
        return {
            **self.to_dict(),
            "tags": [tag.to_dict() for tag in self.tags],
        }


class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    slug = db.Column(db.String(50), unique=True, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey("category.id"), nullable=False)

    category = db.relationship("Category", back_populates="tags")
    posts = db.relationship("Post", secondary=post_tags, back_populates="tags")

    def to_dict(self):
        return {"id": self.id, "name": self.name, "slug": self.slug}


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(120), unique=True, nullable=False)
    title = db.Column(db.String(200), nullable=False)
    excerpt = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)  # markdown body for the detail page
    cover_image = db.Column(db.String(300), nullable=True)
    published_at = db.Column(db.Date, nullable=False, default=date.today)
    category_id = db.Column(db.Integer, db.ForeignKey("category.id"), nullable=False)

    category = db.relationship("Category", back_populates="posts")
    tags = db.relationship("Tag", secondary=post_tags, back_populates="posts")

    def to_summary_dict(self):
        return {
            "id": self.id,
            "slug": self.slug,
            "title": self.title,
            "excerpt": self.excerpt,
            "cover_image": self.cover_image,
            "published_at": self.published_at.isoformat(),
            "category": self.category.to_dict(),
            "tags": [tag.to_dict() for tag in self.tags],
        }

    def to_detail_dict(self):
        return {**self.to_summary_dict(), "content": self.content}


class Collection(db.Model):
    """A curated grouping of posts, shown in the sidebar (e.g. "Front-End")."""

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    slug = db.Column(db.String(80), unique=True, nullable=False)

    posts = db.relationship("Post", secondary=collection_posts, backref="collections")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "post_count": len(self.posts),
        }


class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100), nullable=False)
    bio = db.Column(db.Text, nullable=False)
    about = db.Column(db.Text, nullable=False)
    avatar_url = db.Column(db.String(300), nullable=True)
    avatar_initials = db.Column(db.String(4), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "role": self.role,
            "bio": self.bio,
            "about": self.about,
            "avatar_url": self.avatar_url,
            "avatar_initials": self.avatar_initials,
        }


class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    url = db.Column(db.String(300), nullable=True)
    description = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "url": self.url,
            "description": self.description,
        }


class ContactLink(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    platform = db.Column(db.String(30), nullable=False)  # "github" | "linkedin"
    label = db.Column(db.String(50), nullable=False)
    url = db.Column(db.String(300), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "platform": self.platform,
            "label": self.label,
            "url": self.url,
        }
