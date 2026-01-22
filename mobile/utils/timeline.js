// utils/timeline.js
import { pxToPt } from '../utils/scale';

export function calculateTimeline(minTime, maxTime, stepHours, timelineHeight, fontSize = 45, paddingTop = 30, paddingBottom = 20) {
  let start = minTime * 60;
  const step = stepHours * 60;

  const maxMinutes = maxTime * 60;
  const remainder = (maxMinutes - start) % step;
  let end = remainder === 0 ? maxMinutes : maxMinutes + (step - remainder);
  if (end > 1440) {
    start -= end - 1440;
    end = 1440;
  }

  const times = [];
  for (let t = start; t <= end; t += step) times.push(t);

  const labelHeight = pxToPt(fontSize) * 1.2;
  const paddingLabels = paddingTop + paddingBottom;
  const usableHeight = timelineHeight - (labelHeight * times.length) - paddingLabels;

  return { start, end, step, times, labelHeight, usableHeight, paddingTop, paddingBottom };
}
