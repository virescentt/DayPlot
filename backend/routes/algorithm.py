from flask import Blueprint, request, jsonify
from backend.db.models import FlexibleTask, PlannedEvent, TemplateEvent, WeekDay
from backend.decorators import token_required
from datetime import datetime, timezone, timedelta
from backend.db.models import db
from sqlalchemy.exc import IntegrityError
from backend.utils.tasks_utils import parse_time_str
from backend.utils.serializers import serialize_task, serialize_template_event
from backend.services.schedule_validator import check_time_conflict

algorithm_bp = Blueprint("algorithm", __name__, url_prefix="/algorithm")


@algorithm_bp.route("", methods=['POST'])
@token_required
def get_free_slots(user):
   
    data = request.get_json()

    start_dt = datetime.fromisoformat(data["startDate"]).astimezone(timezone.utc)
    end_dt = datetime.fromisoformat(data["endDate"]).astimezone(timezone.utc)

    busy = []

    # ---------------------------------------------------
    # 1. FLEXIBLE TASKS
    # ---------------------------------------------------
    for task in FlexibleTask.query.filter(
        FlexibleTask.user_id == user.id,
        FlexibleTask.start_datetime.isnot(None),
        FlexibleTask.end_datetime.isnot(None)
    ):

        start = task.start_datetime
        end = task.end_datetime

        if task.rest_time:
            end = end + timedelta(minutes=task.rest_time.value)

        if end < start_dt or start > end_dt:
            continue

        busy.append((max(start, start_dt), min(end, end_dt)))

    # ---------------------------------------------------
    # 2. PLANNED EVENTS
    # ---------------------------------------------------
    for event in PlannedEvent.query.filter_by(user_id=user.id):

        start = event.start_datetime
        end = event.end_datetime

        if event.rest_time:
            end = end + timedelta(minutes=event.rest_time.value)

        if end < start_dt or start > end_dt:
            continue

        busy.append((max(start, start_dt), min(end, end_dt)))

    # ---------------------------------------------------
    # 3. TEMPLATE EVENTS (EXPAND BY DAYS)
    # ---------------------------------------------------
    current = start_dt.date()

    while current <= end_dt.date():

        weekday = WeekDay[current.strftime("%A").upper()]

        templates = TemplateEvent.query.filter_by(
            user_id=user.id,
            day_of_week=weekday
        ).all()

        for t in templates:
            start = datetime.combine(current, t.start_time, tzinfo=timezone.utc)
            end = datetime.combine(current, t.end_time, tzinfo=timezone.utc)

            if end < start_dt or start > end_dt:
                continue

            busy.append((max(start, start_dt), min(end, end_dt)))

        current += timedelta(days=1)

    # ---------------------------------------------------
    # 4. SORT + MERGE
    # ---------------------------------------------------
    busy.sort(key=lambda x: x[0])

    merged = []

    for s, e in busy:
        if not merged:
            merged.append((s, e))
            continue

        ls, le = merged[-1]

        if s <= le:
            merged[-1] = (ls, max(le, e))
        else:
            merged.append((s, e))

    # ---------------------------------------------------
    # 5. INVERT → FREE SLOTS
    # ---------------------------------------------------
    free = []
    cursor = start_dt

    for s, e in merged:
        if cursor < s:
            free.append({
                "start": cursor.isoformat(),
                "end": s.isoformat()
            })

        cursor = max(cursor, e)

    if cursor < end_dt:
        free.append({
            "start": cursor.isoformat(),
            "end": end_dt.isoformat()
        })

    return jsonify({
        "freeSlots": free
    })