import { View, Text, StyleSheet, Pressable } from 'react-native';
import { pxToPt } from '../../utils/scale';
import { useContext, useState } from 'react';
import { TasksContext } from '../../context/TasksContext';
import { TASK_COLORS } from '../../constants/theme';
import EditDeleteTemplateModal from './addNewForm/Template/EditDeleteTemplateModal';
import { Ionicons } from '@expo/vector-icons';


export default function TaskCard({ task, timelineStyles = null, modeOverride = null }) {
    const { mode, handleToggleDone } = useContext(TasksContext);
    const [modalVisible, setModalVisible] = useState(false);
    const isDone = task.is_done;
    const useDayStyle = modeOverride === 'day' || mode === 'day' || (task.type !== 'template' && (!task.start || !task.end));
    let modalHeader = 'Edit this template?';

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

    // all tasks that are NOT scheduled (in Task Pool) get this styling
    let taskStyleBase = {
        fontSize: pxToPt(50),
        height: 45,
        paddingVertical: 10,
        backgroundColor: colors.background,
        borderColor: colors.border,
        justifyContent: 'flex-start',
    };
    if (timelineStyles != null) {taskStyleBase = timelineStyles};

    // --- WEEK MODE
    if (!useDayStyle) {
        return (
            <View style={[styles.taskContainer, taskStyleBase,
                {backgroundColor: isDone ? '#0beb3f90' : colors.background,}
            ]}>
                <Text style={[styles.taskTitle, { color: colors.text, fontSize: taskStyleBase.fontSize }]} numberOfLines={1}>
                    {task.title}
                </Text>
            </View>
        );
    }

    // --- DAY MODE
    if (useDayStyle) {
        return (
            <>
            <Pressable style={[styles.taskContainer, taskStyleBase, {backgroundColor: isDone ? '#0beb3f90' : colors.background,}]}>
                {/* Flexible task */}
                {task.type === 'flexible' && (
                    <View style={styles.flexibleTaskBar} />
                )}

                <Text style={[styles.taskTitle, { color: colors.text, fontSize: taskStyleBase.fontSize }]} numberOfLines={1}>
                    {task.title.length > 17 ? task.title.substring(0, 17) + '...' : task.title}
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

            </Pressable>

            <EditDeleteTemplateModal
                visible={modalVisible}
                onClose={closeEditModal}
                onThisDay={handleThisDay}
                header={modalHeader}
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
        width: 6,
        backgroundColor: '#0d283d',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        top: 0,
        bottom: 0,
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