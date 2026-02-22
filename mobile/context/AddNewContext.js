import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';
import { SERVER_IP } from '../constants/services';

export const AddNewContext = createContext();

export const AddNewProvider = ({ children }) => {
  // --- Common fields ---
  const [common, setCommon] = useState({
    step: 1,
    taskType: null,
    title: 'New Task',
    description: '',
    categoryName: null,
  });

  // --- FlexibleTask ---
  const [newTask, setNewTask] = useState({
    priority: 1,
    estimatedHours: 0,
    deadline: null,
    startDatetime: null,
    endDatetime: null,
    reminderOffset: null,
    scheduledBy: null,
  });

  // --- TemplateEvent ---
  const [template, setTemplate] = useState({
    dayOfWeek: null,
    label: '',
    startTime: null,
    endTime: null,
  });


  return (
    <AddNewContext.Provider value={{
      common, setCommon,
      newTask, setNewTask,
      template, setTemplate
    }}>
      {children}
    </AddNewContext.Provider>
  );
};