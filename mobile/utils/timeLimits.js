export const calculateScheduledHours = (visibleTasks, use_template_hours) => {
  let totalMinutes = 0;

  visibleTasks.forEach(task => {
    if (!task.start || !task.end) return;
    if (!use_template_hours && task.type === 'template') return;

    const taskStart = new Date(task.start);
    const taskEnd = new Date(task.end);

    totalMinutes += (taskEnd - taskStart) / (1000 * 60); // in minutes
  });

  return +(totalMinutes / 60).toFixed(2);
};