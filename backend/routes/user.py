from flask import Blueprint, request, jsonify
from backend.db.models import User
from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash
import jwt, os
from datetime import datetime, timedelta
from backend.db.models import db

user_bp = Blueprint("user", __name__)
SECRET_KEY = os.getenv("SECRET_KEY", "or_there_was_no_secret_key")

@user_bp.route("/me", methods=["GET"])
def me():
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.replace("Bearer ", "")

    if not token:
        return jsonify({"message": "Token missing"}), 401

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user = User.query.get(payload["user_id"])
        if not user:
            return jsonify({"message": "User not found"}), 404

        return jsonify({
            "id": user.id,
            "email": user.email,
            "name": user.name
        })
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401
    
@user_bp.route("/update-name", methods=["POST"])
def update_name():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"message": "Token missing"}), 401

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user = User.query.get(payload["user_id"])
        if not user:
            return jsonify({"message": "User not found"}), 404

        data = request.get_json()
        new_name = data.get("name", "").strip()
        if not new_name:
            return jsonify({"message": "Name cannot be empty"}), 400

        user.name = new_name
        db.session.commit()
        return jsonify({"message": "Name updated", "name": new_name})
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401