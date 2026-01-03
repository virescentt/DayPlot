from backend.app import app
from backend.db.models import (
    db, User, Quote, FlexibleTask, PlannedEvent, TimeLimits,
    TemplateEvent, Category, TaskPriority, ScheduleSource, WeekDay, UserCurrency
)
from werkzeug.security import generate_password_hash
from datetime import datetime, time

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
    # 1. Create tables if they don't exist
    db.create_all()

    # 2. Users
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
        user1 = User.query.filter_by(email="user1@test.com").first()
        user2 = User.query.filter_by(email="user2@test.com").first()
        print("Seed: users already exist")

    # 3. Quotes
    if Quote.query.count() == 0:
        quotes = [Quote(content=q) for q in quotes_list]
        db.session.add_all(quotes)
        db.session.commit()
        print("Seed: 10 quotes created")
    else:
        print("Seed: quotes already exist")

    # 4. Categories
    if Category.query.filter_by(user_id=user1.id).count() == 0:
        categories = [
            Category(user_id=user1.id, name="Work"),
            Category(user_id=user1.id, name="School"),
            Category(user_id=user1.id, name="Hobby"),
        ]
        db.session.add_all(categories)
    if Category.query.filter_by(user_id=user2.id).count() == 0:
        categories = [
            Category(user_id=user2.id, name="Work"),
            Category(user_id=user2.id, name="School"),
            Category(user_id=user2.id, name="Hobby"),
        ]
        db.session.add_all(categories)
    db.session.commit()
    print("Seed: Categories created/verified")

    # 5. Flexible Tasks
    start_deadline = datetime(2026, 1, 11, 23, 59)
    if FlexibleTask.query.filter_by(user_id=user1.id).count() == 0:
        flexible_tasks = [
            FlexibleTask(
                user_id=user1.id,
                title="Read a book",
                priority=TaskPriority.LOW,
                estimated_hours=1.5,
                deadline=start_deadline,
                scheduled_by=ScheduleSource.AUTO
            ),
            FlexibleTask(
                user_id=user1.id,
                title="Workout",
                priority=TaskPriority.HIGH,
                estimated_hours=1,
                deadline=start_deadline,
                scheduled_by=ScheduleSource.AUTO
            ),
        ]
        db.session.add_all(flexible_tasks)
    if FlexibleTask.query.filter_by(user_id=user2.id).count() == 0:
        flexible_tasks = [
            FlexibleTask(
                user_id=user2.id,
                title="Project assignment",
                priority=TaskPriority.URGENT,
                estimated_hours=2,
                deadline=start_deadline,
                scheduled_by=ScheduleSource.AUTO
            ),
            FlexibleTask(
                user_id=user2.id,
                title="Practice piano",
                priority=TaskPriority.MEDIUM,
                estimated_hours=1,
                deadline=start_deadline,
                scheduled_by=ScheduleSource.AUTO
            ),
        ]
        db.session.add_all(flexible_tasks)
    db.session.commit()
    print("Seed: Flexible tasks created/verified")

    # 6. Planned Events
    if PlannedEvent.query.filter_by(user_id=user1.id).count() == 0:
        planned_event1 = PlannedEvent(
            user_id=user1.id,
            title="Doctor Appointment",
            estimated_hours=1,
            start_datetime=datetime(2026,1,6,10,0),
            end_datetime=datetime(2026,1,6,11,0)
        )
        db.session.add(planned_event1)
    if PlannedEvent.query.filter_by(user_id=user2.id).count() == 0:
        planned_event2 = PlannedEvent(
            user_id=user2.id,
            title="Team Meeting",
            estimated_hours=2,
            start_datetime=datetime(2026,1,7,14,0),
            end_datetime=datetime(2026,1,7,16,0)
        )
        db.session.add(planned_event2)
    db.session.commit()
    print("Seed: Planned events created/verified")

    # 7. Template Events (для каждого пользователя)
    if TemplateEvent.query.filter_by(user_id=user1.id).count() == 0:
        template_events_user1 = [
            TemplateEvent(
                user_id=user1.id,
                day_of_week=WeekDay.MONDAY,
                label="Gym",
                start_time=time(7,0),
                end_time=time(8,0)
            ),
            TemplateEvent(
                user_id=user1.id,
                day_of_week=WeekDay.WEDNESDAY,
                label="Study",
                start_time=time(18,0),
                end_time=time(20,0)
            ),
            TemplateEvent(
                user_id=user1.id,
                day_of_week=WeekDay.FRIDAY,
                label="Meditation",
                start_time=time(20,0),
                end_time=time(20,30)
            )
        ]
        db.session.add_all(template_events_user1)

    if TemplateEvent.query.filter_by(user_id=user2.id).count() == 0:
        template_events_user2 = [
            TemplateEvent(
                user_id=user2.id,
                day_of_week=WeekDay.MONDAY,
                label="Gym",
                start_time=time(7,0),
                end_time=time(8,0)
            ),
            TemplateEvent(
                user_id=user2.id,
                day_of_week=WeekDay.WEDNESDAY,
                label="Study",
                start_time=time(18,0),
                end_time=time(20,0)
            ),
            TemplateEvent(
                user_id=user2.id,
                day_of_week=WeekDay.FRIDAY,
                label="Meditation",
                start_time=time(20,0),
                end_time=time(20,30)
            )
        ]
        db.session.add_all(template_events_user2)

    db.session.commit()
    print("Seed: Template events created/verified")

    # 8. TimeLimits / User Preferences
    if not user1.preferences:
        prefs1 = TimeLimits(
            user_id=user1.id,
            sleep_start=time(23,0),
            sleep_end=time(7,0),
            max_hours_per_day=8,
            max_hours_per_week=40
        )
        db.session.add(prefs1)
        print("Seed: User1 Time limits created")
    else:
        print("Seed: User1 Time limits already exist")
        
    if not user2.preferences:
        prefs2 = TimeLimits(
            user_id=user2.id,
            sleep_start=time(23,30),
            sleep_end=time(7,30),
            max_hours_per_day=7,
            max_hours_per_week=35
        )
        db.session.add(prefs2)
        print("Seed: User2 Time limits created")
    else:
        print("Seed: User2 Time limits already exist")
        
    db.session.commit()

    # 9. UserCurrency
    if not user1.currency:
        currency1 = UserCurrency(user_id=user1.id, points=0)
        db.session.add(currency1)
        print("Seed: UserCurrency for user1 created")
    else:
        print("UserCurrency for user1 already exist")
        
    if not user2.currency:
        currency2 = UserCurrency(user_id=user2.id, points=10000)
        db.session.add(currency2)
        print("Seed: UserCurrency for user2 created")
    else:
        print("UserCurrency for user2 already exist")
    
    db.session.commit()
        