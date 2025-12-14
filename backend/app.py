from flask import Flask
from backend.db.models import db
from dotenv import load_dotenv
from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent  # /backend
load_dotenv(BASE_DIR / ".env")
DB_URI = os.getenv("DB_URI")


app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = DB_URI

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

if __name__ == "__main__":
    app.run(debug=True)