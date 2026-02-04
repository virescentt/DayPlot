// utils/timeline.js
import { pxToPt } from '../utils/scale';

export function calculateTimeline(minTime, maxTime, stepHours, timelineHeight, mode, fontS = pxToPt(45), paddingTopLabels = 30, paddingBottomLabels = 10) {
  let start = minTime * 60;
  const step = stepHours * 60;
  const minStepDp = 40; 
  
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
  const contentHeight = 1500
  const modeHeight =
  mode === 'day'
    ? contentHeight
    : timelineHeight;
  
  let usableHeight = modeHeight - (labelHeight * times.length) - paddingBottomLabels - paddingTopLabels;
  
  const timeToY = (time, from) => {
    let top = 0;
    const ratio = ((time - start) / (end - start)) 
    
    if (from == 'current') {
        top = ratio * (modeHeight - labelHeight *2 );
    } else if (from == 'vertical'){
        top = ratio * usableHeight;
       
        // if (mode === 'week'){
        //   top = ratio * usableHeight;
        // } else if (mode === 'day') {
        //   const index = times.indexOf(time);
        //   top = paddingTopLabels + index * minStepDp;
        //   top = ratio * usableHeight;
        // }
    }
    
    
    return top;
  };
  console.log(labelHeight)

  const isLineVisible = (currentMinutes) => {
    return currentMinutes >= start && currentMinutes <= end;
};
    
  return { start, end, step, times, labelHeight, contentHeight, usableHeight, paddingTopLabels, paddingBottomLabels, timeToY, isLineVisible, fontS};
}


export function timeToMinutes(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.getHours() * 60 + date.getMinutes();
}