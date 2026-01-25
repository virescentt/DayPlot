// utils/timeline.js
import { pxToPt } from '../utils/scale';

export function calculateTimeline(minTime, maxTime, stepHours, timelineHeight, fontS = pxToPt(45), paddingTopLabels = 30, paddingBottomLabels = 10) {
  let start = minTime * 60;
  const step = stepHours * 60;

  // round up to the nearest multiple of step from start
  const maxMinutes = maxTime * 60;
  const remainder = (maxMinutes - start) % step;
  let end = remainder === 0 ? maxMinutes : maxMinutes + (step - remainder);
  // If we got end time over 24 hours - adjusting 
  if (end > 1440) {
    start -= end - 1440;
    end = 1440;
  }

  const times = [];
  for (let t = start; t <= end; t += step) times.push(t);

  const labelHeight = fontS * 1.2;
  let usableHeight = timelineHeight - (labelHeight * times.length) - paddingBottomLabels - paddingTopLabels;
  
  const timeToY = (time, from) => {
    let top = 0;
    const ratio = ((time - start) / (end - start)) 
    
    if (from == 'current') {
        top = (ratio * (timelineHeight - paddingBottomLabels - paddingTopLabels - (labelHeight / 2) - (times.length * 1)));
    } else if (from == 'vertical'){
        top = ratio * usableHeight;
    }
    
    
    return top;
  };
  const isLineVisible = (currentMinutes) => {
    return currentMinutes >= start && currentMinutes <= end;
};
    
  return { start, end, step, times, labelHeight, usableHeight, paddingTopLabels, paddingBottomLabels, timeToY, isLineVisible, fontS};
}
