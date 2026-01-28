from flask import Blueprint, request, jsonify
from backend.db.models import FlexibleTask, PlannedEvent, TemplateEvent
from backend.decorators import token_required
from datetime import datetime, timezone, timedelta

tasks_bp = Blueprint("tasks", __name__, url_prefix="/tasks")

@tasks_bp.route("", methods=["GET"])
@token_required
def get_tasks(user):
    from_str = request.args.get("from")
    to_str = request.args.get("to")
    if not from_str or not to_str:
        return jsonify({"message": "from and to parameters required"}), 400

    try:
        from_dt = datetime.fromisoformat(from_str).replace(tzinfo=timezone.utc)
        to_dt = datetime.fromisoformat(to_str).replace(tzinfo=timezone.utc)
    except ValueError:
        return jsonify({"message": "Invalid date format"}), 400

    # 1. Flexible tasks
    flexible_tasks = FlexibleTask.query.filter(
        FlexibleTask.user_id == user.id,
        FlexibleTask.start_datetime.isnot(None),
        FlexibleTask.end_datetime.isnot(None),
        FlexibleTask.start_datetime >= from_dt,
        FlexibleTask.end_datetime <= to_dt
    ).all()

    # 2. Planned events
    planned_events = PlannedEvent.query.filter(
        PlannedEvent.user_id == user.id,
        PlannedEvent.start_datetime >= from_dt,
        PlannedEvent.end_datetime <= to_dt
    ).all()

    # 3. Template events
    # выбираем шаблонные события, которые попадают в диапазон по дню недели
    template_events = []
    for te in TemplateEvent.query.filter_by(user_id=user.id).all():
        # проверяем каждый день в диапазоне from_dt - to_dt
        current = from_dt
        while current <= to_dt:
            if current.strftime("%A") == te.day_of_week.value:
                # проверка override
                override = next((o for o in te.overrides if o.date == current.date() and not o.cancelled), None)
                start_time = override.start_time if override and override.start_time else te.start_time
                end_time = override.end_time if override and override.end_time else te.end_time
                label = override.label if override and override.label else te.label
                template_events.append({
                    "id": te.id,
                    "title": label,
                    "start": datetime.combine(current.date(), start_time).isoformat(),
                    "end": datetime.combine(current.date(), end_time).isoformat(),
                    "priority": None,
                    "is_done": False,
                    "category": None,
                    "type": "template"
                })
            current += timedelta(days=1)

    # 4. Serialize flexible + planned
    def serialize_task(t):
        task_type = "flexible" if isinstance(t, FlexibleTask) else "planned"
        return {
            "id": t.id,
            "title": t.title,
            "start": t.start_datetime.isoformat() if t.start_datetime else None,
            "end": t.end_datetime.isoformat() if t.end_datetime else None,
            "priority": getattr(t, "priority", None).name if hasattr(t, "priority") else None,
            "is_done": t.is_done,
            "description": t.description,
            "category": t.category.name if t.category else None,
            "type": task_type
        }

    all_tasks = [serialize_task(t) for t in flexible_tasks + planned_events] + template_events
    return jsonify(all_tasks)