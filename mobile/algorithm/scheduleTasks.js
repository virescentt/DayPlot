export function scheduleTasks(tasks, freeSlots) {
  const scheduled = [];

  const slots = freeSlots.map(s => ({
    start: new Date(s.start),
    end: new Date(s.end),
  }));

  for (const task of tasks) {
    const taskMs = task.estimatedTime * 60 * 1000;
    const restMs = (task.restTime ?? 0) * 60 * 1000;
    const totalMs = taskMs + restMs;

    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      const slotDuration = slot.end - slot.start;

      if (slotDuration >= totalMs) {
        const start = new Date(slot.start);

        const taskEnd = new Date(start.getTime() + taskMs);
        const restEnd = new Date(taskEnd.getTime() + restMs);

        // ❗ проверка дедлайна (важно)
        if (task.deadline) {
          const deadline = new Date(task.deadline);
          if (taskEnd > deadline) continue;
        }

        scheduled.push({
          ...task,
          start: start.toISOString(),
          end: taskEnd.toISOString(), // ← only task, without restTime
        });

        // cutting the slot taking into account rest
        slots[i].start = restEnd;

        break;
      }
    }
  }

  return scheduled;
}