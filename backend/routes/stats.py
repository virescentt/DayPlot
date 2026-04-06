from flask import Blueprint, jsonify, request
from backend.decorators import token_required
from backend.db.models import TimeLimits, db 

stats_bp = Blueprint("stats", __name__, url_prefix="/stats")


@stats_bp.route("", methods=['GET'])
@token_required
def get_stats(user):
    limits = TimeLimits.query.filter_by(user_id=user.id).first()

    if not limits:
        return jsonify({
            "sleep_start": "23:00",
            "sleep_end": "07:00",
            "max_hours_per_day": 8,
            "max_hours_per_week": 40,
            "use_template_hours": True
        })

    return jsonify({
        "sleep_start": limits.sleep_start.strftime("%H:%M"),
        "sleep_end": limits.sleep_end.strftime("%H:%M"),
        "max_hours_per_day": limits.max_hours_per_day,
        "max_hours_per_week": limits.max_hours_per_week,
        "use_template_hours": limits.use_template_hours,

    })

@stats_bp.route("", methods=['PUT'])
@token_required
def update_stats(user):
    data = request.get_json()
    limits = TimeLimits.query.filter_by(user_id=user.id).first()

    if not limits:
        limits = TimeLimits(user_id=user.id)
        db.session.add(limits)

    limits.sleep_start = data.get("sleep_start", limits.sleep_start)
    limits.sleep_end = data.get("sleep_end", limits.sleep_end)
    limits.max_hours_per_day = data.get("max_hours_per_day", limits.max_hours_per_day)
    limits.max_hours_per_week = data.get("max_hours_per_week", limits.max_hours_per_week)
    limits.use_template_hours = data.get("use_template_hours", limits.use_template_hours)

    db.session.commit()

    return jsonify({"message": "Stats updated successfully"})