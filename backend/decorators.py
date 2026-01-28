from flask import request, jsonify
from backend.db.models import User
import jwt, os

SECRET_KEY = os.getenv("SECRET_KEY", "or_there_was_no_secret_key")

def token_required(f):
    def decorated(*args, **kwargs):
        # проверяем токен
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")
        if not token or token.count(".") != 2:
            return jsonify({"message": "Token missing"}), 401
        
        # декодируем токен
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user = User.query.get(payload.get("user_id"))
        if not user:
            return jsonify({"message": "User not found"}), 404

        # вызываем функцию, которую декоратор оборачивает
        return f(user, *args, **kwargs)
    return decorated