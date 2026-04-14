import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext';
import { deleteTask, fetchPoolTasks, fetchTasks, toggleTaskDone } from '../services/tasks';
import { getWeekOffsetForDay, getWeekRange } from '../utils/tasks';
import { TasksContext } from './TasksContext';
import { Alert } from 'react-native';
import { runAutoDistribute } from '../algorithm/runAutoDistribute';

export const SelectedTaskContext = createContext();

export const SelectedTaskProvider = ({ children }) => {
  const { token } = useContext(AuthContext)
  const { handleToggleDone, onRefresh, loadPoolTasks, poolTasks } = useContext(TasksContext)
    
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

  // =========================================================
  const [poolBottomSheetVisible, setPoolBottomSheetVisible] = useState(false);

  const onOpenTaskPool = async () => {
    loadPoolTasks();
    setPoolBottomSheetVisible(true);
  }
 
  // =========================================================
  const [returnToPool, setReturnToPool] = useState(false);

  // when opening TaskBottomSheet from tasl pool
  const openTaskFromPool = (task) => {
    setReturnToPool(true);  // remember that we should go back to task pool
    setPoolBottomSheetVisible(false);
    setTimeout(() => {
        setSelectedTask(task);
        setBottomSheetVisible(true);
    }, 400);
  };

  // When closing TaskBottomSheet
  const closeTaskSheet = () => {
    setBottomSheetVisible(false);
    setSelectedTask(null);
    
    if (returnToPool) {
      setPoolBottomSheetVisible(true);
      setReturnToPool(false);
    }
  };

  // ==========================================================
  const [showRestModal, setShowRestModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [tempTasks, setTempTasks] = useState([]);

  const handleAutoDistribute = () => {
    const hasMissingRest = poolTasks.some(t => !t.restTime);

    if (hasMissingRest) {
      setShowRestModal(true);
      return;
    } else {
      setTempTasks(poolTasks);
      setShowDateModal(true);
    }
  };

  const handleGenerateRest = () => {
    const updated = poolTasks.map(task => {
      if (task.restTime) return task;

      const rest = Math.min(
        Math.max(5, Math.round(task.estimatedTime * 0.15)),
        30
      );

      return { ...task, restTime: rest };
    });

    setTempTasks(updated);
    setShowRestModal(false);
    setShowDateModal(true);
  };

  const handleSkipRest = () => {
    setTempTasks(poolTasks);
    setShowRestModal(false);
    setShowDateModal(true);
  };

  const handleRunAlgorithm = (start, end) => {
    const result = runAutoDistribute(token, tempTasks, start, end);
    console.log("\n\n\nAFTER AUTO DIRSTIBUTE\n\n\n")
    // setTasks(result); // или setPoolTasks / контекст
    setShowDateModal(false);
  }

  return (
    <SelectedTaskContext.Provider value={{
      selectedTask, setSelectedTask, bottomSheetVisible, setBottomSheetVisible,ToggleDoneBottomSheet, onDeleteTask, poolBottomSheetVisible, setPoolBottomSheetVisible, onOpenTaskPool, openTaskFromPool, closeTaskSheet, handleGenerateRest, handleSkipRest, handleAutoDistribute, handleRunAlgorithm, showRestModal, showDateModal, tempTasks, setShowRestModal, setShowDateModal
    }}>
      {children}
    </SelectedTaskContext.Provider>
  );
};