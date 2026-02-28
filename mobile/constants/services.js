export const SERVER_IP = process.env.EXPO_PUBLIC_SERVER_IP

export const REST_TIME = [
    { label: 'None', value: null },
    { label: '5 min', value: 'MIN_5' },
    { label: '15 min', value: 'MIN_15'},
    { label: '30 min', value: 'MIN_30'},
    { label: '1 hour', value: 'HOUR_1' },
]


export const REMINDER_OFFSET = [
    { label: 'None', value: null },
    { label: '10 min', value: 'MIN_30' },
    { label: '30 min', value: 'MIN_30' },
    { label: '1 hour', value: 'HOUR_1' },
    { label: '1 day', value: 'DAY_1' }
]
export const TASK_TYPES = {
  plot_twist: 'flexible',
  plot: 'planned',
  edit_schedule: 'template',
};