# fucking hack ❗❌📛
from datetime import datetime

def parse_time_str(s):
    if not s:
        return None
    # s — string of the form "HH:MM"
    return datetime.strptime(s, "%H:%M").time()