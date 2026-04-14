export function scheduleTasks(tasks, freeSlots) {
  const scheduled = [];

  const slots = freeSlots.map(s => ({
    start: new Date(s.start),
    end: new Date(s.end),
  }));

  for (const task of tasks) {
    const rest = task.restTime ?? 0; // если null
    const totalMinutes = task.estimatedTime + rest;
    const durationMs = totalMinutes * 60 * 1000;

    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      const slotDuration = slot.end - slot.start;

      if (slotDuration >= durationMs) {
        const start = new Date(slot.start);
        const end = new Date(start.getTime() + durationMs);

        scheduled.push({
          ...task,
          start: start.toISOString(),
          end: end.toISOString(),
        });

        // режем слот (сдвигаем начало)
        slots[i].start = end;

        break;
      }
    }
  }

  return scheduled;
}