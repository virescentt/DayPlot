import { View, Text, StyleSheet, Pressable } from 'react-native';
import { pxToPt } from '../../utils/scale';
import { useContext, useState } from 'react';
import { TasksContext } from '../../context/TasksContext';
import { TASK_COLORS } from '../../constants/theme';
import EditDeleteTemplateModal from './EditDeleteTemplateModal';
import { Ionicons } from '@expo/vector-icons';
import { timeToMinutes } from '../../utils/timeline';

export default function TimelineTask({ task, timeToY }) {
    const { mode, handleToggleDone } = useContext(TasksContext);
    const [modalVisible, setModalVisible] = useState(false);
    const isDone = task.is_done;
    
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
    

    const openEditModal = () => setModalVisible(true);
    const closeEditModal = () => setModalVisible(false);

    const handleThisDay = () => { setModalVisible(false); };
    const handleFutureDays = () => { setModalVisible(false); };

    const colors = TASK_COLORS[task.type]; // will choose automatically by its type
    let fontS = pxToPt(50);
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
            if (taskHeight < 30) fontS = pxToPt(30), paddingVertical = 0;
            else if (taskHeight <= 50) fontS = pxToPt(50), paddingVertical = 0;
            else fontS = pxToPt(50), paddingVertical = 10;
        } else if (mode === 'day') {
            if (taskHeight < 30) fontS = pxToPt(20), paddingVertical = 2;
            else if (taskHeight <= 50) fontS = pxToPt(30), paddingVertical = 2;
            else fontS = pxToPt(50), paddingVertical = 5;
        }
    }

    const taskStyleBase = {
        height: taskHeight,
        top: topStart,
        paddingVertical,
        backgroundColor: colors.background,
        borderColor: colors.border,
        justifyContent: paddingVertical === 0 ? 'center' : 'flex-start'
    };

    // --- WEEK MODE
    if (mode === 'week') {
        return (
            <View style={[styles.taskContainer, taskStyleBase,
                {backgroundColor: isDone ? '#0beb3f90' : colors.background,}
            ]}>
                <Text style={[styles.taskTitle, { color: colors.text, fontSize: fontS }]} numberOfLines={1}>
                    {task.title}
                </Text>
            </View>
        );
    }

    // --- DAY MODE
    if (mode === 'day') {
        return (
            <>
            <Pressable style={[styles.taskContainer, taskStyleBase, {backgroundColor: isDone ? '#0beb3f90' : colors.background,}]}>
                {/* Flexible task */}
                {task.type === 'flexible' && (
                    <View style={styles.flexibleTaskBar} />
                )}

                <Text style={[styles.taskTitle, { color: colors.text, fontSize: fontS }]} numberOfLines={1}>
                    {task.title}
                </Text>

                {/* Priority for flexible */}
                {task.type === 'flexible' && task.priority !== null && (
                    <Text style={styles.priorityText}>Priority: {task.priority}</Text>
                )}

                {/* Time Icon + checkbox Container */}
                <View style={styles.taskFooter}>
                    {/* Time icon */}
                    <Ionicons name="time-outline" size={16} color={colors.text} style={{marginRight: 3}} />
                    
                    {/* Time text */}
                    <Text style={[styles.timeText, {color: colors.text}]}>
                        {task.start.slice(11,16)} - {task.end.slice(11,16)}
                    </Text>

                    {/* Checkbox */}
                    {task.type !== 'template' ? (
                        <Pressable onPress={() => handleToggleDone(task.id, task.type)} style={styles.checkbox}>
                            <Ionicons
                                name={isDone ? 'checkbox' : 'square-outline'}
                                size={20}
                                color={isDone ? '#0d283d' : '#3d6984'}
                            />
                        </Pressable>
                    ) : (
                        <Pressable style={styles.editIcon} onPress={openEditModal}>
                            <Ionicons name="pencil" size={16} color="#fff" />
                        </Pressable>
                    )}
                </View>

                {/* Icon "more" (for flexible & planned) */}
                {(task.type === 'flexible' || task.type === 'planned') && (
                    <Ionicons name="chevron-forward" size={20} color="#3d6984" style={styles.moreIcon} />
                )}

                {/* Pencil Icon for template */}
                {/* {task.type === 'template' && (
                    <Pressable style={styles.taskFooter} onPress={openEditModal}>
                        <Ionicons name="pencil" size={16} color="#fff" />
                    </Pressable>
                )} */}
            </Pressable>

            <EditDeleteTemplateModal
                visible={modalVisible}
                onClose={closeEditModal}
                onThisDay={handleThisDay}
                onFutureDays={handleFutureDays}
            />
            </>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    taskContainer: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
    },
    taskTitle: {
        fontFamily: 'System',
    },
    flexibleTaskBar: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 6,
        height: '115%',
        backgroundColor: '#0d283d',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    priorityText: {
        marginTop: 4,
        fontSize: 12,
        color: '#0d283d',
    },
    taskFooter: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 12,
        color: '#0d283d',
        marginRight: 5,
    },
    checkbox: {
        marginLeft: 5,
    },
    moreIcon: {
        position: 'absolute',
        top: 5,
        right: 5,
    },
    editIcon: {
        marginLeft: 5,
    },
});