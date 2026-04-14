const PRIORITY_WEIGHT = 0.5;
const DEADLINE_WEIGHT = 0.5;

const PRIORITY_MAP = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  URGENT: 4,
};

function getDaysUntil(deadline) {
  const now = new Date();
  const d = new Date(deadline);
  return (d - now) / (1000 * 60 * 60 * 24);
}

export function calcTaskScore(task) {
  const priority = PRIORITY_MAP[task.priority] ?? 1;
  const priorityScore = (priority - 1) / 3; // LOW:0, MEDIUM:0.33, HIGH:0.66, URGENT:1
  
  const days = getDaysUntil(task.deadline);
  
  // deadlineScore: the FEWER days (including negative), the GREATER the score
  // The closer the deadline (or the longer the delay), the more important
  let deadlineScore;
  if (days <= 0) {
    // Overdue or today: the rate increases with each day of delay
    deadlineScore = 1 + Math.abs(days) / 7; //max ~2-3
  } else {
    // Not expired: smooth decline
    deadlineScore = 1 / (1 + days / 3);
  }
  
  return (PRIORITY_WEIGHT * priorityScore) + (DEADLINE_WEIGHT * deadlineScore);
}