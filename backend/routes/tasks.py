from flask import Blueprint, request, jsonify
from backend.db.models import FlexibleTask, PlannedEvent, TemplateEvent
from backend.decorators import token_required
from datetime import datetime, timezone, timedelta
from backend.db.models import db

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
    # choosing template events, which fall within the range by day of the week
    template_events = []
    for te in TemplateEvent.query.filter_by(user_id=user.id).all():
        # checing every day for the range of from_dt - to_dt
        current = from_dt
        while current <= to_dt:
            if current.strftime("%A") == te.day_of_week.value:
                # checking override
                override = next((o for o in te.overrides if o.date == current.date() and not o.cancelled), None)
                start_time = override.start_time if override and override.start_time else te.start_time
                end_time = override.end_time if override and override.end_time else te.end_time
                label = override.label if override and override.label else te.label
                template_events.append({
                    "id": te.id,
                    "title": label,
                    "start": datetime.combine(current.date(), start_time).isoformat(),
                    "end": datetime.combine(current.date(), end_time).isoformat(),
                                        
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


@tasks_bp.route('/<int:task_id>/toggle-done', methods=['PATCH'])
@token_required
def toggle_task_done(user, task_id):
    data = request.get_json(silent=True) or {}
    task_type = data.get("type")

    if task_type not in ("flexible", "planned"):
        return jsonify({"error": "Invalid task type"}), 400

    if task_type == "flexible":
        task = FlexibleTask.query.filter_by(
            id=task_id,
            user_id=user.id
        ).first()

    elif task_type == "planned":
        task = PlannedEvent.query.filter_by(
            id=task_id,
            user_id=user.id
        ).first()

    if not task:
        return jsonify({"error": "Task not found"}), 404

    task.is_done = not task.is_done
    db.session.commit()

    return jsonify({
        "id": task.id,
        "type": task_type,
        "is_done": task.is_done
    }), 200
