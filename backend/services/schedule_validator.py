from backend.db.models import FlexibleTask, PlannedEvent, TemplateEvent
from backend.db.models import FlexibleTask, PlannedEvent, TemplateEvent

def check_time_conflict(user_id,
                        start_dt=None,
                        end_dt=None,
                        start_time=None,
                        end_time=None,
                        weekday=None):

    if start_dt and end_dt:

        planned = PlannedEvent.query.filter(
            PlannedEvent.user_id == user_id,
            PlannedEvent.start_datetime < end_dt,
            PlannedEvent.end_datetime > start_dt
        ).first()

        if planned:
            return True

        flexible = FlexibleTask.query.filter(
            FlexibleTask.user_id == user_id,
            FlexibleTask.start_datetime.isnot(None),
            FlexibleTask.end_datetime.isnot(None),
            FlexibleTask.start_datetime < end_dt,
            FlexibleTask.end_datetime > start_dt
        ).first()

        if flexible:
            return True


    if weekday and start_time and end_time:

        template = TemplateEvent.query.filter(
            TemplateEvent.user_id == user_id,
            TemplateEvent.day_of_week == weekday,
            TemplateEvent.start_time < end_time,
            TemplateEvent.end_time > start_time
        ).first()

        if template:
            return True

    return False