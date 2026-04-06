import { createContext, useContext, useEffect, useState } from 'react';
import { editStats, fetchStats } from '../services/stats';
import { TasksContext } from './TasksContext';
import { AuthContext } from './AuthContext';
import { calculateScheduledHours } from '../utils/timeLimits';
import { Alert } from 'react-native';

export const TimeLimitsContext = createContext();

export const TimeLimitsProvider = ({ children }) => {

  const defaultStats = {
     'sleep_start': '23:00',
     'sleep_end': '7:00',
     'max_hours_per_day': '8',
     'max_hours_per_week': '40',
     'use_template_hours': true,
  }
  const {token} = useContext(AuthContext)
  const {visibleTasks, setLoading} = useContext(TasksContext)
  const [stats, setStats] = useState(defaultStats)
  const [statsBefore, setStatsBefore] = useState(stats)
  const [scheduledHours, setScheduledHours] = useState(null)


  // "sleep_start": limits.sleep_start.strftime("%H:%M"),
  // "sleep_end": limits.sleep_end.strftime("%H:%M"),
  // "max_hours_per_day": limits.max_hours_per_day,
  // "max_hours_per_week": limits.max_hours_per_week,
  // "use_template_hours": limits.use_template_hours,

  const onSave = async () => {
    try {
      await editStats(token, stats);
      setStatsBefore(stats);
      Alert.alert("Saved", "Changes successfully saved");
    } catch (e) {
      Alert.alert("Error", "Could not save changes");
    }
  }

  const loadStats = async (token) => {
    //   setLoading(true);
      const data = await fetchStats(token)
      setStats(data)
      setStatsBefore(data)
    //   setLoading(false);
  };

  useEffect(() => {
    loadStats(token);
    console.log("STATSSSSS context: ", stats)
  }, []);

  useEffect(() => {
    setScheduledHours(calculateScheduledHours(visibleTasks, stats.use_template_hours))
  }, [visibleTasks]);

  return (
    <TimeLimitsContext.Provider value={{
        stats, setStats, scheduledHours, statsBefore, setStatsBefore, onSave
    }}>
      {children}
    </TimeLimitsContext.Provider>
  );
};