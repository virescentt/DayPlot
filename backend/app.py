from flask import Flask
from backend.db.models import db
from backend.routes.auth import auth_bp
from backend.routes.user import user_bp
from backend.routes.tasks import tasks_bp
from dotenv import load_dotenv
from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent  # /backend
load_dotenv(BASE_DIR / ".env")
DB_URI = os.getenv("DB_URI")
PORT = int(os.getenv("PORT"))


app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = DB_URI

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(user_bp, url_prefix="/user")
app.register_blueprint(tasks_bp, url_prefix="/tasks")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=True)