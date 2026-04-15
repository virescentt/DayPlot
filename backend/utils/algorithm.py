from flask import Blueprint, request, jsonify
from backend.db.models import FlexibleTask, PlannedEvent, TemplateEvent, WeekDay, TimeLimits
from backend.decorators import token_required
from datetime import datetime, timezone, timedelta

def get_flexible_tasks(user, start_dt, end_dt):
    busy = []

    tasks = FlexibleTask.query.filter(
        FlexibleTask.user_id == user.id,
        FlexibleTask.start_datetime.isnot(None),
        FlexibleTask.end_datetime.isnot(None)
    )

    for task in tasks:
        start = task.start_datetime
        end = task.end_datetime

        if task.rest_time:
            end += timedelta(minutes=task.rest_time.value)

        if end < start_dt or start > end_dt:
            continue

        busy.append((max(start, start_dt), min(end, end_dt)))

    return busy

def get_planned_events(user, start_dt, end_dt):
    busy = []

    events = PlannedEvent.query.filter_by(user_id=user.id)

    for event in events:
        start = event.start_datetime
        end = event.end_datetime

        if event.rest_time:
            end += timedelta(minutes=event.rest_time.value)

        if end < start_dt or start > end_dt:
            continue

        busy.append((max(start, start_dt), min(end, end_dt)))

    return busy

def get_template_events(user, start_dt, end_dt):
    busy = []

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

    return busy

def get_sleep_blocks(user, start_dt, end_dt):
    busy = []

    limits = TimeLimits.query.filter_by(user_id=user.id).first()
    if not limits:
        return busy

    current = start_dt.date()

    while current <= end_dt.date():

        sleep_start = datetime.combine(current, limits.sleep_start, tzinfo=timezone.utc)

        # если сон через полночь
        if limits.sleep_end < limits.sleep_start:
            sleep_end = datetime.combine(current + timedelta(days=1), limits.sleep_end, tzinfo=timezone.utc)
        else:
            sleep_end = datetime.combine(current, limits.sleep_end, tzinfo=timezone.utc)

        busy.append((sleep_start, sleep_end))

        current += timedelta(days=1)

    return busy


def merge_intervals(intervals):
    if not intervals:
        return []

    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]

    for current in intervals[1:]:
        last_start, last_end = merged[-1]

        if current[0] <= last_end:
            merged[-1] = (last_start, max(last_end, current[1]))
        else:
            merged.append(current)

    return merged

def invert_intervals(merged, start_dt, end_dt):
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

    return free