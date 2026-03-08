import { createContext, useEffect, useState } from 'react';
import { fetchCreateTask } from '../services/tasks';

export const AddNewContext = createContext();

export const AddNewProvider = ({ children }) => {
  // const defaultDeadline = new Date(Date.now() + 60 * 60 * 1000);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getDefaultDeadline = () =>
    new Date(Date.now() + 60 * 60 * 1000 * 24).toISOString();

  const getDefaultStartDatetime = () =>
    new Date(Date.now()).toISOString();

  const getDefaultEndDatetime = () =>
    new Date(Date.now() + 60 * 60 * 1000).toISOString();


   const isChanged = () => {
    // checking common props
    for (let key in defaultCommon) if (common[key] !== defaultCommon[key]) return true;
    // checking newTask props
    if (
      newTask.priority !== "LOW" ||
      newTask.estimatedTime !== 0 ||
      newTask.reminderOffset !== null ||
      newTask.restTime !== null ||
      newTask.scheduledBy !== "MANUAL"
    ) return true;
    // checking tempalte props
    for (let key in defaultTemplate) if (template[key] !== defaultTemplate[key]) return true;
    return false;
  };


  // fields that wont be sent to the server
  const defaultUtils = {
    step: 1,
    useSchedule: false
  };

  // --- Common fields ---
  const defaultCommon = {
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
    startDatetime: getDefaultStartDatetime(),
    endDatetime: getDefaultEndDatetime(),
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
  const [utils, setUtils] = useState(defaultUtils);

  const resetForm = () => {
    setCommon(defaultCommon);
    setNewTask(defaultNewTask());
    setTemplate(defaultTemplate);
    setUtils(defaultUtils);
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
      utils, setUtils,
      loading,
      error,
      createTask,
      resetForm,
      isChanged
    }}>
      {children}
    </AddNewContext.Provider>
  );
};