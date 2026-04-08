import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext';
import { fetchPoolTasks, fetchTasks, toggleTaskDone } from '../services/tasks';
import { getWeekOffsetForDay, getWeekRange } from '../utils/tasks';
import { TasksContext } from './TasksContext';

export const SelectedTaskContext = createContext();

export const SelectedTaskProvider = ({ children }) => {
  const { handleToggleDone } = useContext(TasksContext)
    
  const [selectedTask, setSelectedTask] = useState(null);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const ToggleDoneBottomSheet = (taskId, taskType) => {
    handleToggleDone(taskId, taskType);

    if (selectedTask?.id === taskId) {
        setSelectedTask(prev => ({
        ...prev,
        is_done: !prev.is_done
        }));
    }
  };
 
  return (
    <SelectedTaskContext.Provider value={{
      selectedTask, setSelectedTask, bottomSheetVisible, setBottomSheetVisible,ToggleDoneBottomSheet
    }}>
      {children}
    </SelectedTaskContext.Provider>
  );
};