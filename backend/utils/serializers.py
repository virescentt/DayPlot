from backend.db.models import FlexibleTask
from backend.db.models import PlannedEvent
from datetime import datetime

def serialize_task(t: FlexibleTask | PlannedEvent):
    is_flexible = isinstance(t, FlexibleTask)

    return {
        "id": t.id,
        "title": t.title,
        "description": t.description,

        "start": t.start_datetime.isoformat() if t.start_datetime else None,
        "end": t.end_datetime.isoformat() if t.end_datetime else None,

        "is_done": t.is_done,

        "category": t.category.name if t.category else None,

        "type": "flexible" if is_flexible else "planned",

        # --- only for flexible ---
        "priority": t.priority.name if is_flexible and t.priority else None,
        "estimatedTime": t.estimated_time if is_flexible else None,
        "deadline": t.deadline.isoformat() if is_flexible and t.deadline else None,

        # --- common for both ---
        "reminderOffset": t.reminder_offset.name if t.reminder_offset else None,
        "restTime": t.rest_time.name if t.rest_time else None,
    }

def serialize_template_event(te, date, start_time, end_time, label):
    return {
        "id": te.id,
        "title": label,
        "description": te.description,

        "start": datetime.combine(date, start_time).isoformat(),
        "end": datetime.combine(date, end_time).isoformat(),

        "type": "template",
    }