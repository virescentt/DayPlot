import { pxToPt } from '../../utils/scale';
import { useContext } from 'react';
import { TasksContext } from '../../context/TasksContext';
import { TASK_COLORS } from '../../constants/theme';
import { timeToMinutes } from '../../utils/timeline';
import TaskCard from './TaskCard';

export default function TimelineTask({ task, timeToY }) {
    const { mode } = useContext(TasksContext);
    
     // If mode == 'week', then we simply keep that shit in a View, if mode == 'day', then in a Pressable.
     /**  The color of a background will depend on a type #3d6984:
      * flexible = backgr #e1eaf3, border #3d6984, text #0d283d 
      * event = backgr #0d283d, border #3d6984, text #e1eaf3 
      * template = backgr #3d6984, border #0d283d, text #c8d7e3
      *
      * Priority levels for flexible tasks:
      * 1 - low: #cdd7e0
      * 2 - medium: #3d6984
      * 3 - high: #1a507a
      * 4 - urgent: #0d283d 
    
     */
    
    const colors = TASK_COLORS[task.type]; // will choose automatically by its type
    let fontS = pxToPt(50);
    
    // ⬇⬇ SOME WEIRD SHIT BRUH GET FUCKING RID OF THAT ⬇⬇
                let taskHeight = 40;
    
    let topStart = 0;
    let paddingVertical = 0;

    if (task.start && task.end) {
        const startMinutes = timeToMinutes(task.start);
        const endMinutes = timeToMinutes(task.end);
        topStart = timeToY(startMinutes, 'current');
        const topEnd = timeToY(endMinutes, 'current');
        taskHeight = topEnd - topStart;

        // setting up font size and padding vertical based on task height (time duration)
        if (mode === 'week') {
            if (taskHeight < 30) fontS = pxToPt(20), paddingVertical = 0;
            else if (taskHeight <= 50) fontS = pxToPt(40), paddingVertical = 0;
            else fontS = pxToPt(40), paddingVertical = 10;
        } else if (mode === 'day') {
            if (taskHeight < 30) fontS = pxToPt(20), paddingVertical = 2;
            else if (taskHeight <= 50) fontS = pxToPt(20), paddingVertical = 2;
            else fontS = pxToPt(40), paddingVertical = 5;
        }
    }

    // all tasks that are scheduled get this styling
    const timelineStyles = {
        fontSize: fontS,
        height: taskHeight,
        top: topStart,
        paddingVertical,
        backgroundColor: colors.background,
        borderColor: colors.border,
        justifyContent: paddingVertical === 0 ? 'center' : 'flex-start'
    };

    console.log(task.id + "\t\t" + topStart)
    return (
        <TaskCard task={task} timelineStyles={timelineStyles}/>
    );
}