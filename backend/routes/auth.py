from flask import Blueprint, request, jsonify
from backend.db.models import User, db
from werkzeug.security import check_password_hash, generate_password_hash
import jwt, os
from datetime import datetime, timedelta

auth_bp = Blueprint("auth", __name__)
SECRET_KEY = os.getenv("SECRET_KEY", "or_there_was_no_secret_key")

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password_hash, password):
        token = jwt.encode(
            {"user_id": user.id, "exp": datetime.utcnow() + timedelta(days=30)},
            SECRET_KEY,
            algorithm="HS256"
        )
        return jsonify({"access_token": token})
    return jsonify({"message": "Invalid Email or Password"}), 401



@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "This email is already used."}), 400

    user = User(
        email=email,
        password_hash=generate_password_hash(password),
        name=data.get("name", "Username")
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Account created"}), 201
