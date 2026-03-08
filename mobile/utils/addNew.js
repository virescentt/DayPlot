import { TASK_TYPES } from "../constants/services";
import { Alert } from 'react-native';

export function buildTaskRequest(common, newTask, template) {
  const type = TASK_TYPES[common.taskType]
  ? TASK_TYPES[common.taskType]
  : null;
  // console.log(newTask.priority)
  // console.log(common.taskType)

    return {
        type,   // "flexible" | "planned" | "template"
        common: {
        title: common.title,
        description: common.description,
        categoryName: common.categoryName,
        },
        payload: {
        // Flexible / Planned
        priority: newTask.priority,
        estimatedTime: newTask.estimatedTime,
        deadline: newTask.deadline,
        startDatetime: newTask.startDatetime,
        endDatetime: newTask.endDatetime,
        reminderOffset: newTask.reminderOffset,
        restTime: newTask.restTime,
        scheduledBy: newTask.scheduledBy,

        // TemplateEvent
        dayOfWeek: template.dayOfWeek,
        startTime: template.startTime,
        endTime: template.endTime,
        }
    };
}

// for Complete button
export async function handleCreateTask(createTaskFunc, token, taskData) {
  // createTaskFunc — createTask from the context
  try {
    const message = { title: '', body: '' };
    const success = await createTaskFunc(token, taskData);
    if (success) {
      message.title = 'Success!';
      message.body = 'New task added!';
    }
    return { code: 200, message };
  } catch (e) {
    return {
      code: 400,
      message: {
        title: 'Failed',
        body: e.message || 'Something went wrong',
      }
    };
  }
}



export const handleBack = (isChanged, resetForm, step, setUtils) => {
  if (step !== 2) {
    setUtils(prev => ({...prev, step: step - 1}));
  } else if (isChanged()) {
    Alert.alert(
      "Want to exit?",
      "All changes will be lost.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Exit",
          style: "destructive",
          onPress: () => {
            resetForm();
          }
        },
      ]
    );
  } else {
    resetForm();
  }
};


export async function handleComplete (common, newTask, template, createTask, token, setUtils, resetForm) {
  const taskData = buildTaskRequest(common, newTask, template);
  const result = await handleCreateTask(createTask, token, taskData);
  
  Alert.alert(result.message.title, result.message.body);

  if (result.code === 200) {
    setUtils(prev => ({ ...prev, step: 1 }));
    resetForm();
  }
};