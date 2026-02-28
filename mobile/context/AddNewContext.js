import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';
import { SERVER_IP } from '../constants/services';
import { fetchCreateTask } from '../services/tasks';

export const AddNewContext = createContext();

export const AddNewProvider = ({ children }) => {
  // const defaultDeadline = new Date(Date.now() + 60 * 60 * 1000);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getDefaultDeadline = () =>
    new Date(Date.now() + 60 * 60 * 1000).toISOString();

  // --- Common fields ---
  const defaultCommon = {
    step: 1,
    taskType: null,
    title: 'New Task',
    description: '',
    categoryName: null,
  };

  // --- FlexibleTask and PlannedEvent ---
  const defaultNewTask = () => ({
    priority: "LOW",
    estimatedTime: 0,
    deadline: getDefaultDeadline(),
    startDatetime: null,
    endDatetime: null,
    reminderOffset: null,
    restTime: null,
    scheduledBy: 'MANUAL',
  });

  // --- TemplateEvent ---
  const defaultTemplate = {
    dayOfWeek: null,
    startTime: null,
    endTime: null,
  };

  const [common, setCommon] = useState(defaultCommon);
  const [newTask, setNewTask] = useState(defaultNewTask());
  const [template, setTemplate] = useState(defaultTemplate);

  const resetForm = () => {
    setCommon(defaultCommon);
    setNewTask(defaultNewTask());
    setTemplate(defaultTemplate);
  };

  const createTask = async (token, taskData) => {
    setLoading(true);
    setError(null);
    try {
      await fetchCreateTask(token, taskData); 
      return true; // success
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AddNewContext.Provider value={{
      common, setCommon,
      newTask, setNewTask,
      template, setTemplate,
      loading,
      error,
      createTask,
      resetForm
    }}>
      {children}
    </AddNewContext.Provider>
  );
};