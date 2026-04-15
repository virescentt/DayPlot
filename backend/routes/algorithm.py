from flask import Blueprint, request, jsonify
from backend.decorators import token_required
from datetime import datetime, timezone
from backend.utils.algorithm import get_flexible_tasks, get_planned_events, get_sleep_blocks, get_template_events, merge_intervals, invert_intervals

algorithm_bp = Blueprint("algorithm", __name__, url_prefix="/algorithm")


@algorithm_bp.route("", methods=['POST'])
@token_required
def get_free_slots(user):

    data = request.get_json()

    start_dt = datetime.fromisoformat(data["startDate"]).astimezone(timezone.utc)
    end_dt = datetime.fromisoformat(data["endDate"]).astimezone(timezone.utc)

    busy = []

    # 1. обычные задачи
    busy += get_flexible_tasks(user, start_dt, end_dt)

    # 2. события
    busy += get_planned_events(user, start_dt, end_dt)

    # 3. шаблоны
    busy += get_template_events(user, start_dt, end_dt)

    # 4. сон
    busy += get_sleep_blocks(user, start_dt, end_dt)

    # 5. merge
    merged = merge_intervals(busy)

    # 6. free slots
    free = invert_intervals(merged, start_dt, end_dt)

    return jsonify(free)