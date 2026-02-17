from backend.app import app
from backend.db.models import (
    db, User, FlexibleTask, PlannedEvent, TimeLimits,
    TemplateEvent, Category, TaskPriority, ScheduleSource, WeekDay, ReminderOffset
)
from werkzeug.security import generate_password_hash
from datetime import date, datetime, timedelta, time
from random import choice, randint

with app.app_context():
    # 1. Create tables if they don't exist
    db.create_all()

    # 2. Users
    if User.query.count() == 0:
        user1 = User(
            email="user1@test.com",
            password_hash=generate_password_hash("password123"),
            name="User One",
            currency=10000
        )
        user2 = User(
            email="user2@test.com",
            password_hash=generate_password_hash("password123"),
            name="User Two",
            currency=0
        )
        db.session.add_all([user1, user2])
        db.session.commit()
        print("Seed: 2 users created")
    else:
        user1 = User.query.filter_by(email="user1@test.com").first()
        user2 = User.query.filter_by(email="user2@test.com").first()
        print("Seed: users already exist")

    # 3. Categories
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

    # 4. Flexible Tasks
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
                scheduled_by=ScheduleSource.AUTO,
                reminder_offset=ReminderOffset.MIN_30
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
                scheduled_by=ScheduleSource.AUTO,

            ),
            FlexibleTask(
                user_id=user2.id,
                title="Practice piano",
                priority=TaskPriority.MEDIUM,
                estimated_hours=1,
                deadline=start_deadline,
                scheduled_by=ScheduleSource.AUTO,
                reminder_offset=ReminderOffset.HOUR_1
            ),
        ]
        db.session.add_all(flexible_tasks)
    db.session.commit()
    print("Seed: Flexible tasks created/verified")

    # 5. Planned Events
    if PlannedEvent.query.filter_by(user_id=user1.id).count() == 0:
        planned_event1 = PlannedEvent(
            user_id=user1.id,
            title="Doctor Appointment",
            estimated_hours=1,
            start_datetime=datetime(2026,1,6,10,0),
            end_datetime=datetime(2026,1,6,11,0),
            reminder_offset=ReminderOffset.DAY_1
        )
        db.session.add(planned_event1)
    if PlannedEvent.query.filter_by(user_id=user2.id).count() == 0:
        planned_event2 = PlannedEvent(
            user_id=user2.id,
            title="Team Meeting",
            estimated_hours=2,
            start_datetime=datetime(2026,1,7,14,0),
            end_datetime=datetime(2026,1,7,16,0),
        )
        db.session.add(planned_event2)
    db.session.commit()
    print("Seed: Planned events created/verified")

    # 6. Template Events (для каждого пользователя)
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

    # 7. TimeLimits / User Preferences
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


    # ----------------------
    # Удаляем пользователя и все его данные, если существует
    # ----------------------
    # Удаляем существующего пользователя и всё, что к нему относится
    existing_user = User.query.filter_by(email="xxx@gmail.com").first()
    if existing_user:
        # Сначала удаляем категории, чтобы не было зависимостей
        Category.query.filter_by(user_id=existing_user.id).delete()
        FlexibleTask.query.filter_by(user_id=existing_user.id).delete()
        PlannedEvent.query.filter_by(user_id=existing_user.id).delete()
        TemplateEvent.query.filter_by(user_id=existing_user.id).delete()
        TimeLimits.query.filter_by(user_id=existing_user.id).delete()
        
        # Теперь удаляем самого пользователя
        db.session.delete(existing_user)
        db.session.commit()
        print(f"Deleted existing user {existing_user.email} and all related data")
    # ----------------------
    # Создаем пользователя
    # ----------------------
    user3 = User(
        email="xxx@gmail.com",
        password_hash=generate_password_hash("dayplot"),
        name="Test User",
        currency=5000
    )
    db.session.add(user3)
    db.session.commit()

    # ----------------------
    # Категории
    # ----------------------
    categories = [
        Category(user_id=user3.id, name="Work"),
        Category(user_id=user3.id, name="School"),
        Category(user_id=user3.id, name="Hobby"),
    ]
    db.session.add_all(categories)
    db.session.commit()

    # ----------------------
    # Шаблонные события (Учеба + спорт)
    # ----------------------
    template_events_user3 = [
        TemplateEvent(user_id=user3.id, day_of_week=WeekDay.MONDAY, label="University Study", start_time=time(8,0), end_time=time(13,0)),
        TemplateEvent(user_id=user3.id, day_of_week=WeekDay.MONDAY, label="Boxing Training", start_time=time(13,30), end_time=time(14,30)),
        TemplateEvent(user_id=user3.id, day_of_week=WeekDay.TUESDAY, label="University Study", start_time=time(9,0), end_time=time(15,0)),
        TemplateEvent(user_id=user3.id, day_of_week=WeekDay.WEDNESDAY, label="University Study", start_time=time(8,30), end_time=time(14,30)),
        TemplateEvent(user_id=user3.id, day_of_week=WeekDay.WEDNESDAY, label="Volleyball", start_time=time(18,0), end_time=time(19,0)),
        TemplateEvent(user_id=user3.id, day_of_week=WeekDay.THURSDAY, label="University Study", start_time=time(9,0), end_time=time(15,30)),
        TemplateEvent(user_id=user3.id, day_of_week=WeekDay.FRIDAY, label="University Study", start_time=time(8,0), end_time=time(12,30)),
    ]
    db.session.add_all(template_events_user3)
    db.session.commit()

    # ----------------------
    # Ограничения по времени
    # ----------------------
    prefs3 = TimeLimits(
        user_id=user3.id,
        sleep_start=time(23,0),
        sleep_end=time(7,0),
        max_hours_per_day=5,
        max_hours_per_week=20
    )
    db.session.add(prefs3)
    db.session.commit()

    # ----------------------
    # Вспомогательные функции
    # ----------------------
    used_time_slots = {}

    def is_free(d, start, end):
        slots = used_time_slots.get(d, [])
        for s, e in slots:
            if (start < e and end > s):
                return False
        return True

    def add_slot(d, start, end):
        slots = used_time_slots.get(d, [])
        slots.append((start,end))
        used_time_slots[d] = slots

    def schedule_event(d, start, duration_hours, title):
        end_time = (datetime.combine(date.min, start) + timedelta(hours=duration_hours)).time()
        add_slot(d, start, end_time)
        return PlannedEvent(
            user_id=user3.id,
            title=title,
            estimated_hours=duration_hours,
            start_datetime=datetime.combine(d, start),
            end_datetime=datetime.combine(d, end_time)
        )

    # ----------------------
    # Планируем шаблонные события на все дни
    # ----------------------
    start_date = date(2026,1,26)
    end_date = date(2026,2,15)
    delta = timedelta(days=1)

    planned_events = []

    current_date = start_date
    while current_date <= end_date:
        weekday_str = current_date.strftime("%A")
        weekday = WeekDay(weekday_str)
        for te in template_events_user3:
            if te.day_of_week == weekday:
                add_slot(current_date, te.start_time, te.end_time)
                pe = PlannedEvent(
                    user_id=user3.id,
                    title=te.label,
                    estimated_hours=(datetime.combine(date.min, te.end_time) - datetime.combine(date.min, te.start_time)).seconds / 3600,
                    start_datetime=datetime.combine(current_date, te.start_time),
                    end_datetime=datetime.combine(current_date, te.end_time)
                )
                planned_events.append(pe)
        current_date += delta

    # ----------------------
    # Чёткие плановые события
    # ----------------------
    planned_events = []

    # Плановые задачи, которые хотим вставить
    fixed_planed_tasks = [
        (date(2026,1,26), time(15,30), 1, "Team Meeting"),
        (date(2026,1,27), time(16,0), 1.5, "Doctor Appointment"),
        (date(2026,1,28), time(14,0), 2, "Workshop"),
        (date(2026,1,29), time(10,0), 1, "Call with Client"),
        (date(2026,1,30), time(17,0), 1, "Study Group"),
        (date(2026,2,2), time(11,0), 1.5, "Library Visit"),
        (date(2026,2,3), time(15,0), 2, "Team Meeting"),
        (date(2026,2,4), time(13,0), 1, "Doctor Appointment"),
        (date(2026,2,5), time(16,0), 1, "Workshop"),
        (date(2026,2,6), time(12,0), 1, "Call with Client"),
        (date(2026,2,9), time(15,30), 1.5, "Study Group"),
        (date(2026,2,10), time(10,0), 1, "Library Visit"),
        (date(2026,2,11), time(14,0), 2, "Team Meeting"),
        (date(2026,2,12), time(16,0), 1, "Doctor Appointment"),
        (date(2026,2,13), time(13,0), 1, "Workshop"),
    ]

    for d, start, duration, title in fixed_planed_tasks:
        end_time = (datetime.combine(date.min, start) + timedelta(hours=duration)).time()
        # Проверка, что слот свободен (шаблонные + гибкие уже заняты)
        if is_free(d, start, end_time):
            add_slot(d, start, end_time)
            pe = PlannedEvent(
                user_id=user3.id,
                title=title,
                estimated_hours=duration,
                start_datetime=datetime.combine(d, start),
                end_datetime=datetime.combine(d, end_time)
            )
            planned_events.append(pe)

    db.session.add_all(planned_events)
    db.session.commit()
    print("Planned events created without randomization, respecting template and flexible tasks")

    # ----------------------
    # Гибкие задачи 22 штуки с распределением по дням
    # ----------------------
    flexible_tasks_data = [
        ("Prepare Math Test", TaskPriority.HIGH, 2, date(2026,2,5)),
        ("Complete Homework", TaskPriority.MEDIUM, 3, date(2026,2,8)),
        ("Read Technical Book", TaskPriority.MEDIUM, 1.5, date(2026,2,15)),
        ("Prepare Presentation", TaskPriority.HIGH, 3, date(2026,2,12)),
        ("Science Project Work", TaskPriority.MEDIUM, 4, date(2026,2,15)),
        ("Read Literature", TaskPriority.LOW, 2, date(2026,2,10)),
        ("Practice Piano", TaskPriority.MEDIUM, 1, date(2026,2,6)),
        ("Write Essay", TaskPriority.HIGH, 2.5, date(2026,2,9)),
        ("Research Assignment", TaskPriority.MEDIUM, 3, date(2026,2,13)),
        ("Study Algorithms", TaskPriority.HIGH, 2, date(2026,2,14)),
        ("Lab Work Chemistry", TaskPriority.MEDIUM, 3, date(2026,2,7)),
        ("Read History", TaskPriority.LOW, 2, date(2026,2,11)),
        ("Prepare Physics Problems", TaskPriority.HIGH, 2, date(2026,2,8)),
        ("Write Report Biology", TaskPriority.MEDIUM, 2, date(2026,2,12)),
        ("Practice Drawing", TaskPriority.LOW, 1.5, date(2026,2,6)),
        ("Prepare Geography Notes", TaskPriority.MEDIUM, 2, date(2026,2,9)),
        ("English Essay", TaskPriority.HIGH, 2.5, date(2026,2,10)),
        ("Practice Coding", TaskPriority.HIGH, 3, date(2026,2,13)),
        ("Prepare Statistics Assignment", TaskPriority.MEDIUM, 2, date(2026,2,14)),
        ("Read Philosophy", TaskPriority.LOW, 1.5, date(2026,2,11)),
        ("Practice Music", TaskPriority.MEDIUM, 2, date(2026,2,7)),
        ("Write Summary Notes", TaskPriority.LOW, 1, date(2026,2,15)),
    ]

    flexible_tasks = []
    for title, priority, hours, deadline_date in flexible_tasks_data:
        for attempt in range(20):
            start_hour = randint(7, 20-int(hours))
            start_minute = choice([0,30])
            start_dt = time(start_hour, start_minute)
            end_dt = (datetime.combine(date.min, start_dt) + timedelta(hours=hours)).time()
            if is_free(deadline_date, start_dt, end_dt):
                add_slot(deadline_date, start_dt, end_dt)
                ft = FlexibleTask(
                    user_id=user3.id,
                    title=title,
                    priority=priority,
                    estimated_hours=hours,
                    start_datetime=datetime.combine(deadline_date, start_dt),
                    end_datetime=datetime.combine(deadline_date, end_dt),
                    deadline=datetime.combine(deadline_date, time(23,59)),
                    scheduled_by=ScheduleSource.AUTO
                )
                flexible_tasks.append(ft)
                break

    db.session.add_all(flexible_tasks)
    db.session.commit()
    print("Full schedule created: шаблонные, плановые и гибкие задачи без пересечений")
        