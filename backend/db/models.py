from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone, timedelta, time
from sqlalchemy import Enum
import enum
from sqlalchemy.orm import validates

db = SQLAlchemy()

class TaskPriority(enum.Enum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    URGENT = 4

class ReminderOffset(enum.Enum):
    MIN_10 = 10
    MIN_30 = 30
    HOUR_1 = 60
    DAY_1 = 1440


class RestTime(enum.Enum):
    MIN_5 = 5
    MIN_15 = 15
    MIN_30 = 30
    HOUR_1 = 60

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
    currency = db.Column(db.Integer, default=0)
    
    # relations with other tables
    flexible_tasks = db.relationship('FlexibleTask', backref='user', lazy='dynamic')

# ---------- Flexible Tasks ----------
class FlexibleTask(db.Model):
    __tablename__ = "flexible_tasks"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Required fields
    title = db.Column(db.String(100), nullable=False)
    priority = db.Column(Enum(TaskPriority), nullable=False)  # 1-4, 4 — highest
    estimated_time = db.Column(db.Float, nullable=False)  # from 15 minutes to 300 minutes (5 hours)
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
    reminder_offset = db.Column(Enum(ReminderOffset, name="reminder_offset_enum"), nullable=True)
    rest_time = db.Column(Enum(RestTime, name="rest_time_enum"), nullable=True)


    # Metadata
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=datetime.now)

    # Date range validation (approximately)
    @staticmethod
    def validate_dates(start_dt=None, end_dt=None, deadline=None):
        now = datetime.now(timezone.utc)
        min_date = now - timedelta(days=60)
        max_date = now + timedelta(days=60)

        # привести к aware
        if start_dt and isinstance(start_dt, str):
            start_dt = datetime.fromisoformat(start_dt).replace(tzinfo=timezone.utc)

        if end_dt and isinstance(end_dt, str):
            end_dt = datetime.fromisoformat(end_dt).replace(tzinfo=timezone.utc)

        if deadline and isinstance(deadline, str):
            deadline = datetime.fromisoformat(deadline).replace(tzinfo=timezone.utc)


        if start_dt and not (min_date <= start_dt <= max_date):
            raise ValueError(f"Start date must be within ±2 months from today")
        if end_dt and not (min_date <= end_dt <= max_date):
            raise ValueError(f"End date must be within ±2 months from today")
        if deadline and not (min_date <= deadline <= max_date):
            raise ValueError(f"Deadline must be within ±2 months from today")
        if start_dt and end_dt and start_dt > end_dt:
            raise ValueError(f"Start datetime cannot be after end datetime")
        if end_dt and deadline and end_dt > deadline:
            raise ValueError(f"End datetime cannot be after the deadline")

    @validates('start_datetime', 'end_datetime', 'deadline')
    def validate_all_dates(self, key, value):
        start = self.start_datetime if key != 'start_datetime' else value
        end = self.end_datetime if key != 'end_datetime' else value
        deadline = self.deadline if key != 'deadline' else value
        self.validate_dates(start, end, deadline)
        return value
        

class PlannedEvent(db.Model):
    __tablename__ = "planned_events"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Required fields
    title = db.Column(db.String(255), nullable=False)
    start_datetime = db.Column(db.DateTime(timezone=True), nullable=False)
    end_datetime = db.Column(db.DateTime(timezone=True), nullable=False)

    is_done = db.Column(db.Boolean, default=False)
    
    # Optional fields
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=True)
    category = db.relationship("Category", backref="planned_events")
    description = db.Column(db.Text, nullable=True)
    reminder_offset = db.Column(Enum(ReminderOffset), nullable=True)
    rest_time = db.Column(Enum(RestTime, name="rest_time_enum"), nullable=True)

    # Метаданные
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=datetime.now)

    # Валидация диапазона дат (опционально)
    @staticmethod
    def validate_dates(start_dt=None, end_dt=None, deadline=None):
        now = datetime.now(timezone.utc)
        min_date = now - timedelta(days=60)
        max_date = now + timedelta(days=60)

        # привести к aware
        if start_dt and isinstance(start_dt, str):
            start_dt = datetime.fromisoformat(start_dt).replace(tzinfo=timezone.utc)

        if end_dt and isinstance(end_dt, str):
            end_dt = datetime.fromisoformat(end_dt).replace(tzinfo=timezone.utc)


        if start_dt and not (min_date <= start_dt <= max_date):
            raise ValueError(f"Start date must be within ±2 months from today")
        if end_dt and not (min_date <= end_dt <= max_date):
            raise ValueError(f"End date must be within ±2 months from today")
        if start_dt and end_dt and start_dt > end_dt:
            raise ValueError(f"Start datetime cannot be after end datetime")

    @validates('start_datetime', 'end_datetime')
    def validate_all_dates(self, key, value):
        start = self.start_datetime if key != 'start_datetime' else value
        end = self.end_datetime if key != 'end_datetime' else value
        self.validate_dates(start, end)
        return value
        
class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = db.Column(db.String(50), nullable=False)
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

    # Optional fields
    description = db.Column(db.Text, nullable=True)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=True)
    category = db.relationship("Category", backref="template_events")


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

    sleep_start = db.Column(db.Time, nullable=False, default=time(23, 0))
    sleep_end = db.Column(db.Time, nullable=False, default=time(7, 0))

    max_hours_per_day = db.Column(db.Float, nullable=False, default=8) #NEED TO ADD
    max_hours_per_week = db.Column(db.Float, nullable=False, default=40) #NEED TO ADD
    use_template_hours = db.Column(db.Boolean, default=True, nullable=False)
    
    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    user = db.relationship("User", backref="preferences")