import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext';
import { fetchPoolTasks, fetchTasks, toggleTaskDone } from '../services/tasks';
import { getWeekRange } from '../utils/tasks';

export const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const { token, user } = useContext(AuthContext);
  // const { setBottomSheetVisible } = useContext(SelectedTaskContext);
  const [tasks, setTasks] = useState([]);
  const [poolTasks, setPoolTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('week');
  const [selectedDay, setSelectedDay] = useState(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [today, setToday] = useState(new Date());

  // Update today at 00:00
  useEffect(() => {
    const now = new Date();
    const nextDay = new Date(now);
    nextDay.setHours(24,0,0,0);
    const timer = setTimeout(() => setToday(new Date()), nextDay - now);
    return () => clearTimeout(timer);
  }, [today]);

  // Tasks loading
  const loadTasks = async (from, to) => {
    setLoading(true);
    const data = await fetchTasks(token, from, to);
    setTasks(data);
    console.log("TASKS FROM LOAD TASKS:")
    console.log(tasks)
    setLoading(false);
  };
  
  const loadPoolTasks = async () => {
    setLoading(true);
    const data = await fetchPoolTasks(token);
    setPoolTasks(data);
    console.log("💦 POOLTASKS 💦 FROM LOAD TASKS:")
    console.log(poolTasks)
    setLoading(false);
  };

  const onRefresh = async () => {
    if (loading) return
    await loadTasks(weekStart, weekEnd)
  }

  // const onDeleteTask = async (taskId, type) => {
  //   try {
  //     await deleteTask(token, taskId, type);
  //     setBottomSheetVisible(false);
  //     await onRefresh()
  //     Alert.alert("Success", "Your task was deleted");
  //   } catch (e) {
  //     Alert.alert("Error", "Could not delete the task");
  //   }
  // }

  
  // Calculating the week !!!! GOD BLESS AMERICA ✔➰➰〰
  const { weekStart, weekEnd, weekDays } = useMemo(() => {
    const weekInfo = getWeekRange(today, weekOffset);
    console.log(weekInfo)
    return getWeekRange(today, weekOffset);
  }, [ today, weekOffset ]);


  const weekKey = useMemo(() => {
    return `${weekStart.getTime()}-${weekEnd.getTime()}`;
  }, [weekStart, weekEnd]);

  useEffect(() => {
    if (!token || !user) return;
    loadTasks(weekStart, weekEnd);
  }, [weekKey, token, user]);

  
  const handleToggleDone = async (taskId, taskType) => {
      if (taskType === 'template') return; // dont touch templates

      try {
          const updatedTask = await toggleTaskDone(taskId, taskType, token);

          // updating tasks array to reload useMemo
          setTasks(prev =>
          prev.map(t =>
              t.id === updatedTask.id && t.type === updatedTask.type ? { ...t, is_done: updatedTask.is_done } : t
          )
          );
      } catch (err) {
          console.log(err);
      }
  };

  // Visible tasks filter
  const visibleTasks = useMemo(() => {
    if (mode === 'week') return tasks;
    if (!selectedDay) return [];
    return tasks.filter(t => new Date(t.start).toDateString() === selectedDay.toDateString());
  }, [tasks, mode, selectedDay]);

  // minTime/maxTime for the timeline
  const { minTime, maxTime } = useMemo(() => {
    if (mode === 'day') return { minTime: 0, maxTime: 24}
    if (!tasks.length) return { minTime: 7, maxTime: 22 };
    let min = Infinity, max = -Infinity;
    for (const t of tasks) {
      const s = new Date(t.start);
      const e = new Date(t.end);
      min = Math.min(min, s.getHours() + s.getMinutes()/60);
      max = Math.max(max, e.getHours() + e.getMinutes()/60);
    }
    return { minTime: Math.floor(min), maxTime: Math.ceil(max) };
  }, [tasks]);

  return (
    <TasksContext.Provider value={{
      tasks,
      visibleTasks,
      loadTasks,
      loading,
      weekStart,
      weekEnd,
      weekDays,
      minTime,
      maxTime,
      mode,
      setMode,
      selectedDay,
      setSelectedDay,
      weekOffset,
      setWeekOffset,
      today,
      setTasks,
      handleToggleDone,
      poolTasks,
      // onDeleteTask,
      onRefresh
    }}>
      {children}
    </TasksContext.Provider>
  );
};