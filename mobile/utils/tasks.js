import { autoDistribute } from "../algorithm/autoDistributeAlgorithm";
import { fetchFreeSlots } from "../services/algorithm";

export function getWeekRange(baseDate, offset = 0) {
  // PAY ATTENTION TO -1 BCS OF THE UTC DATETIME CODING BRO 💥💥

  const start = new Date(baseDate);
  start.setDate(baseDate.getDate() - ((baseDate.getDay() + 6) % 7) + offset*7);
  start.setHours(1,0,0,0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(0,59,59,999);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });

  return { weekStart: start, weekEnd: end, weekDays: days };
}

export async function goToNextPrev(
  where,
  mode,
  setWeekOffset,
  setSelectedDay,
  selectedDay,
  weekDays
) {
  const step = where === "next" ? 1 : -1;

  if (mode === "week") {
    setWeekOffset(w => w + step);
    return;
  }

  if (mode === "day" && selectedDay) {
    const next = new Date(selectedDay);
    next.setDate(next.getDate() + step);

    // вышли за неделю → меняем weekOffset
    if (next < weekDays[0] || next > weekDays[6]) {
      setWeekOffset(w => w + step);
    }

    setSelectedDay(next);
  }
}


export const filterByDateRange = (tasks, startRange) => {
  console.log("START RANGE RAW:", startRange);
  console.log("START PARSED:", new Date(startRange));
  const start = new Date(startRange);

  return tasks.filter(task => {
    const deadline = new Date(task.deadline);
    console.log("TASK DEADLINE:", task.deadline, new Date(task.deadline));
  console.log("COMPARE:", new Date(task.deadline) >= new Date(startRange));
    return deadline >= start;
  });
};

