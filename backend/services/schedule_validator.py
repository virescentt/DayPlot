from backend.db.models import FlexibleTask, PlannedEvent, TemplateEvent, WeekDay
from datetime import timedelta

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
        for event in PlannedEvent.query.filter_by(user_id=user_id):
            event_end = event.end_datetime

            if event.rest_time:
                event_end = event_end + timedelta(minutes=event.rest_time.value)

            if event.start_datetime < end_dt and event_end > start_dt:
                return True
            
        # 2. FlexibleTask
        for task in FlexibleTask.query.filter(
            FlexibleTask.user_id == user_id,
            FlexibleTask.start_datetime.isnot(None),
            FlexibleTask.end_datetime.isnot(None)
        ):
            task_end = task.end_datetime

            if task.rest_time:
                task_end = task_end + timedelta(minutes=task.rest_time.value)

            if task.start_datetime < end_dt and task_end > start_dt:
                return True

        # 3. TemplateEvent
        # weekday_enum = WeekDay[weekday.upper()]  
        fictive_weekday = WeekDay[start_dt.strftime("%A").upper()]
        print("Artificial weekday: ", fictive_weekday)

        start_time = start_dt.time()
        end_time = end_dt.time()

        if TemplateEvent.query.filter(
            TemplateEvent.user_id == user_id,
            TemplateEvent.day_of_week == fictive_weekday,
            TemplateEvent.start_time < end_time,
            TemplateEvent.end_time > start_time
        ).first():
            return True

    # --- CASE 2: template creation ---
    print("weekday before next IF: ", weekday)

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
        for event in PlannedEvent.query.filter_by(user_id=user_id):
            if event.start_datetime.strftime("%A") != weekday:
                continue

            event_end_time = event.end_datetime

            if event.rest_time:
                event_end_time = (event_end_time + timedelta(minutes=event.rest_time.value)).time()

            if event.start_datetime.time() < end_time and event_end_time > start_time:
                return True
            
        # 3. Template vs FlexibleTask
        for task in FlexibleTask.query.filter(
            FlexibleTask.user_id == user_id,
            FlexibleTask.start_datetime.isnot(None),
            FlexibleTask.end_datetime.isnot(None)
        ):
            if task.start_datetime.strftime("%A") != weekday:
                continue

            task_end = task.end_datetime

            if task.rest_time:
                task_end = task_end + timedelta(minutes=task.rest_time.value)

            if task.start_datetime.time() < end_time and task_end.time() > start_time:
                return True

    return False