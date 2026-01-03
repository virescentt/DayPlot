from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone, timedelta
from sqlalchemy import Enum
import enum

db = SQLAlchemy()

class TaskPriority(enum.Enum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    URGENT = 4

class ScheduleSource(enum.Enum):
    AUTO = "auto"
    MANUAL = "manual"

class WeekDay(enum.Enum):
    MONDAY = "Monday"
    TUESDAY = "Tuesday"
    WEDNESDAY = "Wednesday"
    THURSDAY = "Thursday"
    FRIDAY = "Friday"
    SATURDAY = "Saturday"
    SUNDAY = "Sunday"

# ---------- User table ----------
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    name = db.Column(db.String(30), nullable=False)
    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )
    
    # relations with other tables
    currency = db.relationship('UserCurrency', backref='user', uselist=False)
    flexible_tasks = db.relationship('FlexibleTask', backref='user', lazy='dynamic')

# ---------- Quotes that are displayed when the app is loading  ----------
class Quote(db.Model):
    __tablename__ = "quotes"

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(80), nullable=False)


class UserCurrency(db.Model):
    __tablename__ = "user_currency"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    points = db.Column(db.Integer, default=0)
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=datetime.now)


# ---------- Flexible Tasks ----------
class FlexibleTask(db.Model):
    __tablename__ = "flexible_tasks"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Required fields
    title = db.Column(db.String(100), nullable=False)
    priority = db.Column(Enum(TaskPriority), nullable=False)  # 1-4, 4 — highest
    estimated_hours = db.Column(db.Float, nullable=False)  # from 0.25h (15 minutes) to 5h
    deadline = db.Column(db.DateTime(timezone=True), nullable=False)
    scheduled_by = db.Column(
    Enum(ScheduleSource),
    nullable=False,
    default=ScheduleSource.AUTO
    )
    is_done = db.Column(db.Boolean, default=False)
    
    # Optional fields
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=True)
    category = db.relationship("Category", backref="flexible_tasks")
    description = db.Column(db.Text, nullable=True)
    start_datetime = db.Column(db.DateTime(timezone=True), nullable=True)
    end_datetime = db.Column(db.DateTime(timezone=True), nullable=True)


    # Metadata
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=datetime.now)

    # Date range validation (approximately)
    @staticmethod
    def validate_date_range(start_dt, end_dt):
        """Check: start/end from today to +2 months"""
        today = datetime.now(timezone.utc)
        max_date = today + timedelta(days=60)
        if start_dt and not (today <= start_dt <= max_date):
            raise ValueError("Start date must be from today to +2 months")
        if end_dt and not (today <= end_dt <= max_date):
            raise ValueError("End date must be from today to +2 months")
        if start_dt and end_dt and start_dt > end_dt:
            raise ValueError("Start datetime cannot be after end datetime")
        

class PlannedEvent(db.Model):
    __tablename__ = "planned_events"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Required fields
    title = db.Column(db.String(255), nullable=False)
    estimated_hours = db.Column(db.Float, nullable=False)  # от 0.25 до 5 часов
    start_datetime = db.Column(db.DateTime(timezone=True), nullable=False)
    end_datetime = db.Column(db.DateTime(timezone=True), nullable=False)
    is_done = db.Column(db.Boolean, default=False)

    # Optional fields
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=True)
    category = db.relationship("Category", backref="planned_events")
    description = db.Column(db.Text, nullable=True)

    # Метаданные
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=datetime.now)

    # Валидация диапазона дат (опционально)
    @staticmethod
    def validate_date_range(start_dt, end_dt):
        today = datetime.now(timezone.utc)
        max_date = today + timedelta(days=60)
        if not (today <= start_dt <= max_date):
            raise ValueError("Start date must be from today to +2 months")
        if not (today <= end_dt <= max_date):
            raise ValueError("End date must be from today to +2 months")
        if start_dt > end_dt:
            raise ValueError("Start datetime cannot be after end datetime")
        
class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = db.Column(db.String(50), nullable=False)  # название категории, например "school", "work", "hobby"
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=datetime.now)

    # relation back to the user
    user = db.relationship("User", backref="categories")

class TemplateEvent(db.Model):
    __tablename__ = "template_events"

    id = db.Column(db.Integer, primary_key=True)
    
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    day_of_week = db.Column(Enum(WeekDay), nullable=False)  # Monday ... Sunday
    label = db.Column(db.String(100), nullable=False)
    start_time = db.Column(db.Time, nullable=False)  # only time
    end_time = db.Column(db.Time, nullable=False)

    # category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=True)
    # category = db.relationship("Category", backref="template_events")


class TemplateEventOverride(db.Model):
    __tablename__ = "template_event_overrides"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    template_event_id = db.Column(db.Integer, db.ForeignKey("template_events.id", ondelete="CASCADE"), nullable=False)
    date = db.Column(db.Date, nullable=False)  # the server will set this automatically based on which specific day is changing

    # If the field is false, the event simply is not showed for this date.
    cancelled = db.Column(db.Boolean, default=False)
    
    # if user want to change time or a label for a specific day
    start_time = db.Column(db.Time, nullable=True)
    end_time = db.Column(db.Time, nullable=True)
    label = db.Column(db.String(100), nullable=True)

    template_event = db.relationship("TemplateEvent", backref="overrides")


class TimeLimits(db.Model):
    __tablename__ = "time_limits"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )

    # BY DEFAULT or when using auto planning for the first time or right after registration 
    # sleep_start = 23:00
    # sleep_end   = 07:00

    # Сон (период, куда НЕЛЬЗЯ ставить задачи)
    sleep_start = db.Column(db.Time, nullable=False)
    sleep_end = db.Column(db.Time, nullable=False)

    # Ограничения нагрузки
    max_hours_per_day = db.Column(db.Float, nullable=False)
    max_hours_per_week = db.Column(db.Float, nullable=False)

    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    user = db.relationship("User", backref="preferences")