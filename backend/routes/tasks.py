from flask import Blueprint, request, jsonify
from backend.db.models import FlexibleTask, PlannedEvent, TemplateEvent, Category
from backend.decorators import token_required
from datetime import datetime, timezone, timedelta
from backend.db.models import db
from sqlalchemy.exc import IntegrityError
from backend.utils.tasks_utils import parse_time_str
from backend.utils.serializers import serialize_task, serialize_template_event
from backend.services.schedule_validator import check_time_conflict

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

    # --- 1. Flexible tasks ---
    flexible_tasks = FlexibleTask.query.filter(
        FlexibleTask.user_id == user.id,
        FlexibleTask.start_datetime.isnot(None),
        FlexibleTask.end_datetime.isnot(None),
        FlexibleTask.start_datetime >= from_dt,
        FlexibleTask.end_datetime <= to_dt
    ).all()

    # --- 2. Planned events ---
    planned_events = PlannedEvent.query.filter(
        PlannedEvent.user_id == user.id,
        PlannedEvent.start_datetime >= from_dt,
        PlannedEvent.end_datetime <= to_dt
    ).all()

    # --- 3. Template ---
    # choosing template events, which fall within the range by day of the week
    template_events = []
    templates = TemplateEvent.query.filter_by(user_id=user.id).all()

    current = from_dt
    while current <= to_dt:
        for te in templates:
            if current.strftime("%A") != te.day_of_week.value:
                continue

            override = next(
                (o for o in te.overrides
                 if o.date == current.date() and not o.cancelled),
                None
            )

            start_time = override.start_time if override and override.start_time else te.start_time
            end_time = override.end_time if override and override.end_time else te.end_time
            label = override.label if override and override.label else te.label

            template_events.append(
                serialize_template_event(
                    te,
                    current.date(),
                    start_time,
                    end_time,
                    label
                )
            )

        current += timedelta(days=1)

    # --- 4. All in one ---
    all_tasks = (
        [serialize_task(t) for t in flexible_tasks + planned_events]
        + template_events
    )
    return jsonify(all_tasks)

@tasks_bp.route("/pool", methods=["GET"])
@token_required
def get_task_pool(user):
    tasks = FlexibleTask.query.filter(
        FlexibleTask.user_id == user.id,
        FlexibleTask.start_datetime.is_(None),
        FlexibleTask.end_datetime.is_(None),
        # FlexibleTask.is_done == False   # maybe later for the filtration by done flag
    ).all()

    return jsonify([serialize_task(t) for t in tasks])


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



@tasks_bp.route("", methods=["POST"])
@token_required
def create_task(user):
    print("HELLO ADD NEW TASK!!!")

    data = request.json

    task_type = data.get("type")
    common = data.get("common", {})
    payload = data.get("payload", {})

    category = (
    Category.query.filter_by(
        name=common.get("categoryName"),
        user_id=user.id
        ).first()
        if common.get("categoryName")
        else None
    )

    start_dt = end_dt = weekday = None
    match task_type:
        case "flexible" | "planned":
            start_dt = payload.get("startDatetime")
            end_dt = payload.get("endDatetime")
            
            if (start_dt is not None and end_dt is not None):
                start_str = datetime.fromisoformat(start_dt).strftime("%H:%M")
                end_str = datetime.fromisoformat(end_dt).strftime("%H:%M")
                start_dt = datetime.fromisoformat(start_dt).replace(tzinfo=timezone.utc)
                end_dt = datetime.fromisoformat(end_dt).replace(tzinfo=timezone.utc)
                if check_time_conflict(user_id=user.id, start_dt=start_dt, end_dt=end_dt):
                    return jsonify({"error": f"Time of {start_str}-{end_str} is crossing other your tasks at picked day. Please, change picked time period or day"}), 400

        case "template":
            start_dt = parse_time_str(payload.get("startTime"))
            end_dt = parse_time_str(payload.get("endTime"))
            weekday = payload.get("dayOfWeek")
            if check_time_conflict(user_id=user.id, start_time=start_dt, end_time=end_dt, weekday=weekday):
                return jsonify({"error": f"Time of {start_dt}-{end_dt} is crossing other your tasks at picked day of a week. Please, change picked time period"}), 400

        case _:
            return jsonify({"error": "type required"}), 400
    

    try:
        if task_type == "flexible":
            task = FlexibleTask(
                user_id=user.id,
                title=common.get("title"),
                description=common.get("description"),
                category=category,

                priority=payload.get("priority"),
                estimated_time=payload.get("estimatedTime"),
                deadline=payload.get("deadline"),

                start_datetime=start_dt,
                end_datetime=end_dt,

                reminder_offset=payload.get("reminderOffset"),
                rest_time=payload.get("restTime"),
                scheduled_by=payload.get("scheduledBy"),
            )
        elif task_type == "planned":
            task = PlannedEvent(
                user_id=user.id,
                title=common["title"],
                description=common.get("description"),

                start_datetime=start_dt,
                end_datetime=end_dt,

                reminder_offset=payload.get("reminderOffset"),
                rest_time=payload.get("restTime"),
            )
        elif task_type == "template":
            
            task = TemplateEvent(
                user_id=user.id,
                label=payload.get("label"),
                description=common.get("description"),
                category=category,

                day_of_week=weekday,
                start_time=start_dt,
                end_time=end_dt,
                
            )
        else:
            return jsonify({"error": "Invalid type"}), 400

    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

    
    try:
        db.session.add(task)
        db.session.commit()
        return jsonify({"id": task.id}), 201


    except IntegrityError as e:
        db.session.rollback()

        return jsonify({
            "error": "Database validation failed",
            "details": str(e)
        }), 400


@tasks_bp.route("/<int:task_id>", methods=["DELETE"])
@token_required
def delete_task(user, task_id):
    task_type = request.args.get("type")

    if task_type not in ("flexible", "planned", "template"):
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

    elif task_type == "template":
        task = TemplateEvent.query.filter_by(
            id=task_id,
            user_id=user.id
        ).first()

    if not task:
        return jsonify({"error": "Task not found"}), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": "Task deleted"}), 200