from backend.db.models import FlexibleTask, PlannedEvent, TemplateEvent, WeekDay
from datetime import datetime, timezone

def check_time_conflict(user_id,
                        start_dt=None,
                        end_dt=None,
                        start_time=None,
                        end_time=None,
                        weekday=None):

    
    # --- CASE 1: real datetime (flexible / planned) ---
    print("dayofweek, weekday", weekday)
    if start_dt and end_dt:

        # 1. PlannedEvent
        if PlannedEvent.query.filter(
            PlannedEvent.user_id == user_id,
            PlannedEvent.start_datetime < end_dt,
            PlannedEvent.end_datetime > start_dt
        ).first():
            return True

        # 2. FlexibleTask
        if FlexibleTask.query.filter(
            FlexibleTask.user_id == user_id,
            FlexibleTask.start_datetime.isnot(None),
            FlexibleTask.end_datetime.isnot(None),
            FlexibleTask.start_datetime < end_dt,
            FlexibleTask.end_datetime > start_dt
        ).first():
            return True

        # 3. TemplateEvent (через день недели)
        # weekday_enum = WeekDay[weekday.upper()]  
        weekday = WeekDay[start_dt.strftime("%A").upper()]
        start_time = start_dt.time()
        end_time = end_dt.time()

        if TemplateEvent.query.filter(
            TemplateEvent.user_id == user_id,
            TemplateEvent.day_of_week == weekday,
            TemplateEvent.start_time < end_time,
            TemplateEvent.end_time > start_time
        ).first():
            return True

    # --- CASE 2: template creation ---
    if weekday and start_time and end_time:
        weekday = WeekDay[weekday.upper()]
        # 1. Template vs Template
        if TemplateEvent.query.filter(
            TemplateEvent.user_id == user_id,
            TemplateEvent.day_of_week == weekday,
            TemplateEvent.start_time < end_time,
            TemplateEvent.end_time > start_time
        ).first():
            return True

        # 2. Template vs PlannedEvent
        if PlannedEvent.query.filter(
            PlannedEvent.user_id == user_id
        ).all():
            for event in PlannedEvent.query.filter_by(user_id=user_id):
                if event.start_datetime.strftime("%A") != weekday:
                    continue

                if (
                    event.start_datetime.time() < end_time and
                    event.end_datetime.time() > start_time
                ):
                    return True

        # 3. Template vs FlexibleTask
        for task in FlexibleTask.query.filter(
            FlexibleTask.user_id == user_id,
            FlexibleTask.start_datetime.isnot(None),
            FlexibleTask.end_datetime.isnot(None)
        ):
            if task.start_datetime.strftime("%A") != weekday:
                continue

            if (
                task.start_datetime.time() < end_time and
                task.end_datetime.time() > start_time
            ):
                return True

    return False