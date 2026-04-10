import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext';
import { deleteTask, fetchPoolTasks, fetchTasks, toggleTaskDone } from '../services/tasks';
import { getWeekOffsetForDay, getWeekRange } from '../utils/tasks';
import { TasksContext } from './TasksContext';
import { Alert } from 'react-native';

export const SelectedTaskContext = createContext();

export const SelectedTaskProvider = ({ children }) => {
  const { token } = useContext(AuthContext)
  const { handleToggleDone, onRefresh } = useContext(TasksContext)
    
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

  const onDeleteTask = async (taskId, type) => {
    try {
      await deleteTask(token, taskId, type);
      setSelectedTask(null);
      onRefresh();
      setBottomSheetVisible(false);

      Alert.alert("Success", "Your task was deleted");
    } catch (e) {
      Alert.alert("Error", e.message);
    }
};
 
  return (
    <SelectedTaskContext.Provider value={{
      selectedTask, setSelectedTask, bottomSheetVisible, setBottomSheetVisible,ToggleDoneBottomSheet, onDeleteTask
    }}>
      {children}
    </SelectedTaskContext.Provider>
  );
};