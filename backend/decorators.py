from flask import request, jsonify
from backend.db.models import User
import jwt, os
from functools import wraps

SECRET_KEY = os.getenv("SECRET_KEY", "or_there_was_no_secret_key")

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")

        print("AUTH HEADER:", auth_header)
        print("TOKEN:", token)
        
        if not token or token.count(".") != 2:
            return jsonify({"message": "Token missing"}), 401

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401

        user = User.query.get(payload.get("user_id"))
        if not user:
            return jsonify({"message": "User not found"}), 404

        
        return f(user, *args, **kwargs)

    return decorated