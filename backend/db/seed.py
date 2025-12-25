from backend.app import app
from backend.db.models import db, User, Quote
from werkzeug.security import generate_password_hash

quotes_list = [
    "Act, don’t wait.",
    "Strength overcomes weakness.",
    "Every day is a step forward.",
    "Mistakes fuel growth.",
    "Will is enough to start.",
    "Do today, be proud tomorrow.",
    "Strive until you achieve.",
    "Decisions matter more than circumstances.",
    "Persistence breaks barriers.",
    "Your progress is your power."
]



with app.app_context():
    # 1. creating tables, if they dont exist
    db.create_all()

    # 2. check if there are users. If not - creates 2 users
    if User.query.count() == 0:
        user1 = User(
            email="user1@test.com",
            password_hash=generate_password_hash("password123"),
            name="User One"
        )

        user2 = User(
            email="user2@test.com",
            password_hash=generate_password_hash("password123"),
            name="User Two"
        )

        db.session.add_all([user1, user2])
        db.session.commit()

        print("Seed: 2 users created")
    else:
        print("Seed: users already exist")
    
    if Quote.query.count() == 0:
        quotes = [Quote(content=q) for q in quotes_list]
        db.session.add_all(quotes)
        db.session.commit()

        print("Seed: 10 quotes created")
    else:
        print("Seed: quotes already exist")