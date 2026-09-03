import os
import threading
import time
from collections import defaultdict

from flask import Blueprint, jsonify, request
from google import genai
from google.genai import errors as genai_errors
from google.genai import types

from app.models import Post, Profile, Project

chat_bp = Blueprint("chat", __name__)

MODEL = "gemini-3.6-flash"
MAX_MESSAGE_LENGTH = 800
MAX_HISTORY_TURNS = 6
RATE_LIMIT = 15
RATE_WINDOW_SECONDS = 300

_rate_lock = threading.Lock()
_rate_buckets: dict[str, list[float]] = defaultdict(list)


def _is_rate_limited(ip: str) -> bool:
    now = time.time()
    with _rate_lock:
        bucket = _rate_buckets[ip]
        bucket[:] = [t for t in bucket if now - t < RATE_WINDOW_SECONDS]
        if len(bucket) >= RATE_LIMIT:
            return True
        bucket.append(now)
        return False


def _build_system_instruction() -> str:
    profile = Profile.query.first()
    posts = Post.query.order_by(Post.published_at.desc()).all()
    projects = Project.query.all()

    lines = [
        "Você é Cleber, o assistente virtual do site pessoal Architech.",
        "Responda de forma breve (no máximo 4 frases), amigável, no mesmo idioma da pergunta.",
        "Use apenas as informações de contexto abaixo. Se não souber algo, diga que não tem "
        "essa informação em vez de inventar.",
    ]

    if profile:
        lines.append(f"\nSobre a autora: {profile.name}, {profile.role}. {profile.about}")

    if projects:
        lines.append("\nProjetos: " + ", ".join(project.name for project in projects))

    if posts:
        lines.append("\nPosts do blog:")
        for post in posts:
            lines.append(f"- {post.title} ({post.category.name}): {post.excerpt}")

    return "\n".join(lines)


def _parse_history(raw_history) -> list[types.Content]:
    if not isinstance(raw_history, list):
        return []

    contents: list[types.Content] = []
    for item in raw_history[-MAX_HISTORY_TURNS:]:
        if not isinstance(item, dict):
            continue
        role = item.get("role")
        text = str(item.get("content", "")).strip()[:MAX_MESSAGE_LENGTH]
        if role not in ("user", "assistant") or not text:
            continue
        gemini_role = "model" if role == "assistant" else "user"
        contents.append(types.Content(role=gemini_role, parts=[types.Part(text=text)]))

    return contents


@chat_bp.post("")
def ask_cleber():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return jsonify({"error": "Cleber está indisponível no momento."}), 503

    ip = request.headers.get("X-Forwarded-For", request.remote_addr) or "unknown"
    if _is_rate_limited(ip):
        return (
            jsonify({"error": "Muitas perguntas em pouco tempo. Tente novamente em alguns minutos."}),
            429,
        )

    data = request.get_json(silent=True) or {}
    message = str(data.get("message", "")).strip()
    if not message:
        return jsonify({"error": "Mensagem vazia."}), 400
    if len(message) > MAX_MESSAGE_LENGTH:
        return jsonify({"error": "Mensagem muito longa."}), 400

    contents = _parse_history(data.get("history"))
    contents.append(types.Content(role="user", parts=[types.Part(text=message)]))

    client = genai.Client(api_key=api_key)
    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=_build_system_instruction(),
                max_output_tokens=500,
            ),
        )
    except genai_errors.APIError as exc:
        if exc.code == 429:
            return (
                jsonify({"error": "Cleber está sobrecarregado, tente novamente em instantes."}),
                429,
            )
        return jsonify({"error": "Cleber não conseguiu responder agora."}), 502

    reply = (response.text or "").strip()
    return jsonify({"reply": reply})
