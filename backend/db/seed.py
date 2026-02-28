from backend.app import app
from backend.db.models import (
    db, User, FlexibleTask, PlannedEvent, TimeLimits,
    TemplateEvent, Category, TaskPriority, ScheduleSource, WeekDay
)
from werkzeug.security import generate_password_hash
from datetime import date, datetime, timedelta, time
from random import choice, randint

with app.app_context():
    db.create_all()

    # ----------------------
    # Пользователь
    # ----------------------
    user = User.query.filter_by(email="xxx@gmail.com").first()
    if not user:
        user = User(
            email="xxx@gmail.com",
            password_hash=generate_password_hash("dayplot"),
            name="Test User",
            currency=5000
        )
        db.session.add(user)
        db.session.commit()

    # ----------------------
    # Категории
    # ----------------------
    for cat_name in ["Work", "School", "Hobby"]:
        if not Category.query.filter_by(user_id=user.id, name=cat_name).first():
            db.session.add(Category(user_id=user.id, name=cat_name))
    db.session.commit()

    # ----------------------
    # TimeLimits
    # ----------------------
    if not user.preferences:
        prefs = TimeLimits(
            user_id=user.id,
            sleep_start=time(23,0),
            sleep_end=time(7,0),
            max_hours_per_day=5,
            max_hours_per_week=20
        )
        db.session.add(prefs)
        db.session.commit()

    # ----------------------
    # TemplateEvents
    # ----------------------
    template_data = [
        (WeekDay.MONDAY, "University Study", time(8,0), time(13,0)),
        (WeekDay.MONDAY, "Boxing Training", time(13,30), time(14,30)),
        (WeekDay.TUESDAY, "University Study", time(9,0), time(15,0)),
        (WeekDay.WEDNESDAY, "University Study", time(8,30), time(14,30)),
        (WeekDay.WEDNESDAY, "Volleyball", time(18,0), time(19,0)),
        (WeekDay.THURSDAY, "University Study", time(9,0), time(15,30)),
        (WeekDay.FRIDAY, "University Study", time(8,0), time(12,30)),
    ]
    for day, label, start, end in template_data:
        if not TemplateEvent.query.filter_by(user_id=user.id, day_of_week=day, label=label).first():
            db.session.add(TemplateEvent(user_id=user.id, day_of_week=day, label=label, start_time=start, end_time=end))
    db.session.commit()

    # ----------------------
    # Слоты для планирования
    # ----------------------
    used_slots = {}

    def is_free(d, start, end):
        slots = used_slots.get(d, [])
        for s, e in slots:
            if (start < e and end > s):
                return False
        return True

    def add_slot(d, start, end):
        slots = used_slots.get(d, [])
        slots.append((start, end))
        used_slots[d] = slots

    # ----------------------
    # Планируем шаблонные события на все дни
    # ----------------------
    start_date = date(2026,1,26)
    end_date = date(2026,2,15)

    template_events = TemplateEvent.query.filter_by(user_id=user.id).all()
    for n in range((end_date - start_date).days + 1):
        current_date = start_date + timedelta(days=n)
        weekday = WeekDay(current_date.strftime("%A"))
        for te in template_events:
            if te.day_of_week == weekday:
                add_slot(current_date, te.start_time, te.end_time)
                if not PlannedEvent.query.filter_by(
                    user_id=user.id, 
                    title=te.label, 
                    start_datetime=datetime.combine(current_date, te.start_time)
                ).first():
                    db.session.add(PlannedEvent(
                        user_id=user.id,
                        title=te.label,
                        start_datetime=datetime.combine(current_date, te.start_time),
                        end_datetime=datetime.combine(current_date, te.end_time)
                    ))
    db.session.commit()

    # ----------------------
    # Чёткие плановые события
    # ----------------------
    fixed_tasks = [
        (date(2026,1,26), time(15,30), 60, "Team Meeting"),
        (date(2026,1,27), time(16,0), 90, "Doctor Appointment"),
        (date(2026,1,28), time(14,0), 120, "Workshop"),
        (date(2026,1,29), time(10,0), 60, "Call with Client"),
    ]
    for d, start, duration_min, title in fixed_tasks:
        end_t = (datetime.combine(date.min, start) + timedelta(minutes=duration_min)).time()
        if is_free(d, start, end_t):
            add_slot(d, start, end_t)
            if not PlannedEvent.query.filter_by(user_id=user.id, title=title, start_datetime=datetime.combine(d, start)).first():
                db.session.add(PlannedEvent(
                    user_id=user.id,
                    title=title,
                    start_datetime=datetime.combine(d, start),
                    end_datetime=datetime.combine(d, end_t)
                ))
    db.session.commit()

    # ----------------------
    # Гибкие задачи (только у них есть estimated_time)
    # ----------------------
    flexible_tasks_data = [
        ("Prepare Math Test", TaskPriority.HIGH, 120, date(2026,2,5)),
        ("Complete Homework", TaskPriority.MEDIUM, 180, date(2026,2,8)),
        ("Read Technical Book", TaskPriority.MEDIUM, 90, date(2026,2,15)),
    ]
    for title, priority, duration_min, deadline_date in flexible_tasks_data:
        for attempt in range(20):
            start_hour = randint(7, 20-int(duration_min/60))
            start_minute = choice([0,30])
            start_t = time(start_hour, start_minute)
            end_t = (datetime.combine(date.min, start_t) + timedelta(minutes=duration_min)).time()
            if is_free(deadline_date, start_t, end_t):
                add_slot(deadline_date, start_t, end_t)
                if not FlexibleTask.query.filter_by(user_id=user.id, title=title, start_datetime=datetime.combine(deadline_date, start_t)).first():
                    db.session.add(FlexibleTask(
                        user_id=user.id,
                        title=title,
                        priority=priority,
                        estimated_time=duration_min,
                        start_datetime=datetime.combine(deadline_date, start_t),
                        end_datetime=datetime.combine(deadline_date, end_t),
                        deadline=datetime.combine(deadline_date, time(23,59)),
                        scheduled_by=ScheduleSource.AUTO
                    ))
                break
    db.session.commit()

    print("Full schedule created: шаблонные, плановые и гибкие задачи без пересечений")