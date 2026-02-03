export function getWeekRange(baseDate, offset = 0) {
  const start = new Date(baseDate);
  start.setDate(baseDate.getDate() - ((baseDate.getDay() + 6) % 7) + offset*7);
  start.setHours(0,0,0,0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23,59,59,999);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });

  return { weekStart: start, weekEnd: end, weekDays: days };
}

export function getWeekOffsetForDay(selectedDay, today) {
  const diffDays = Math.floor((selectedDay - today) / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7);
}

export async function goToNextPrev(where, mode, setWeekOffset, weekOffset, selectedDay, weekDays, loadTasks, setSelectedDay) {
    let offset = 0;
    if (where === "next") offset = 1;
    if (where === "prev") offset = -1;
    
    if (mode === "week") {
        setWeekOffset(weekOffset + offset);
    } else if (mode === "day" && selectedDay) {
        const next = new Date(selectedDay);
        next.setDate(next.getDate() + offset);

        // checking if the next day is within this week
        if (weekDays && (next < weekDays[0] || next > weekDays[6])) {
            // loading new week tasks if it is
            const start = new Date(next);
            start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
            start.setHours(0,0,0,0);
            const end = new Date(start);
            end.setDate(start.getDate() + 6);
            end.setHours(23,59,59,999);
            console.log("Load tasks from func...")
            await loadTasks(start, end);
        }

        setSelectedDay(next);
    }
}