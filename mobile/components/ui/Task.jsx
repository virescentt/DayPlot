import { View, Text, StyleSheet, Pressable } from 'react-native';
import font from '../../constants/typography';
import { pxToPt } from '../../utils/scale';
import { TransitionPresets } from '@react-navigation/bottom-tabs';
import { useContext, useState } from 'react';
import { TasksContext } from '../../context/TasksContext';
import { TASK_COLORS } from '../../constants/theme';
import EditDeleteTemplateModal from './EditDeleteTemplateModal';
import { Ionicons } from '@expo/vector-icons';


export default function Task({ task, timeToY }) {
    const { mode } = useContext(TasksContext);
    const [isDone, setIsDone] = useState(task.is_done);
    const [modalVisible, setModalVisible] = useState(false);
    
    
    const toggleDone = () => setIsDone(prev => !prev);

    // функции для действий
    const openEditModal = () => setModalVisible(true);
    const closeEditModal = () => setModalVisible(false);

    const handleThisDay = () => {
        // логика для "this day only"
        console.log('This day only');
        setModalVisible(false);
    };

    const handleFutureDays = () => {
        // логика для "this and future days"
        console.log('This and future days');
        setModalVisible(false);
    };



    const taskStyles = isDone
        ? [styles.taskContainer, styles.done]
        : [styles.taskContainer];

    const colors = TASK_COLORS[task.type]; // автоматически выберет по типу

    const fontS = pxToPt(41);
    const labelHeight = fontS * 1.2;
    // Если mode == 'week', тогда мы эту хуетень просто во view держим, если mode == 'day', должны в pressable.  
    /** Цвет бекграунда будет зависить от типа задачи #3d6984:
     * flexible = фон #e1eaf3, обводка #3d6984, текст #0d283d
     * event = фон #0d283d, обводка #3d6984, текст #e1eaf3
     * template = фон #3d6984, обводка #0d283d, текст #c8d7e3 */ 

    function timeToMinutes(dateStr) {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return date.getHours() * 60 + date.getMinutes();
    }

    let taskHeight = 100; // дефолт
    let topStart = 0;
    if (task.start && task.end) {
        const startMinutes = timeToMinutes(task.start);
        const endMinutes = timeToMinutes(task.end);
        topStart = timeToY(startMinutes, 'current');
        const topEnd = timeToY(endMinutes, 'current') + 6;
        taskHeight = topEnd - topStart;
    }
    // const start = 420;
    // const end = 960;
    // const topStart = timeToY(start, 'current');
    // const topEnd = timeToY(end, 'current') + 6;
    // const taskHeight = topEnd - topStart;



        // --- WEEK MODE
    if (mode === 'week') {
        return (
        <View style={[
            { backgroundColor: colors.background, 
            borderColor: colors.border,
            height: taskHeight,
            top: topStart },
            taskStyles]}
        >
            <Text 
            style={[styles.taskName, { color: colors.text }]} numberOfLines={1}
            ellipsizeMode="tail"
            >
            {task.title}
            </Text>
            {task.type !== 'template' && (
             <Pressable onPress={toggleDone} style={styles.checkbox}>
                <Ionicons
                name={isDone ? 'checkbox' : 'square-outline'}
                size={20}
                color={isDone ? '#0d283d' : '#3d6984'}
                />
            </Pressable>
            )}
        </View>
        );
    }

    // --- DAY MODE
    if (mode === 'day') {        
        return (
        <>

        <View style={[ 
            { backgroundColor: colors.background, 
            borderColor: colors.border,
            height: taskHeight,
            top: topStart },
            taskStyles]}
        >
           <Text 
            style={[styles.taskName, { color: colors.text }]} numberOfLines={1}
            ellipsizeMode="tail"
            >
            {task.title}
            </Text>

            {task.type !== 'template' && (
             <Pressable onPress={toggleDone} style={styles.checkbox}>
                <Ionicons
                name={isDone ? 'checkbox' : 'square-outline'}
                size={20}
                color={isDone ? '#0d283d' : '#3d6984'}
                />
            </Pressable>
            )}

            


            {task.type === 'template' && (
            <Pressable style={styles.editButton} onPress={openEditModal}>
                <Ionicons name="pencil" size={16} color="#fff" />
            </Pressable>
            )}
        </View>
            {/* Modal when editing/deleting */}
        <EditDeleteTemplateModal
            visible={modalVisible}
            onClose={closeEditModal}
            onThisDay={handleThisDay}
            onFutureDays={handleFutureDays}
        />
        </>
        );
    }

    return null; // на всякий случай
};

const styles = StyleSheet.create({
    taskContainer: {
        width: '100%', 
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 5,
        paddingTop: 9,
    },
    done: {
        backgroundColor: '#0beb3f90'
    },
    taskName: {
        fontFamily: font.Mregular, 
    },
    flexibleTask: {

    },
    plannedEvent: {

    },
    templateEvent: {

    },
    checkbox: {
        position: 'absolute',
        bottom: 5,
        right: 5,
    },
    editButton: { 
        position: 'absolute', 
        bottom: 5, 
        right: 5 
    },
})

//     return (
//         <>
//         <View style={[styles.taskContainer, {height: taskHeight, 
//             top: topStart,
//             backgroundColor: '#3d6984',
//             borderColor: '#0d283d',
//         }]}>

//             <Text style={[styles.taskName, {color: '#c8d7e3' }]}>School</Text>
//         </View>
//         </>
//     );