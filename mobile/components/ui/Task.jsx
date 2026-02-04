import { View, Text, StyleSheet, Pressable } from 'react-native';
import font from '../../constants/typography';
import { pxToPt } from '../../utils/scale';
import { TransitionPresets } from '@react-navigation/bottom-tabs';
import { useContext, useState } from 'react';
import { TasksContext } from '../../context/TasksContext';
import { TASK_COLORS } from '../../constants/theme';
import EditDeleteTemplateModal from './EditDeleteTemplateModal';
import { Ionicons } from '@expo/vector-icons';
import { timeToMinutes } from '../../utils/timeline';


export default function Task({ task, timeToY }) {
    const { mode } = useContext(TasksContext);
    const [isDone, setIsDone] = useState(task.is_done);
    const [modalVisible, setModalVisible] = useState(false);
    
    
    const toggleDone = () => setIsDone(prev => !prev);

    // functions for actions on tasks
    const openEditModal = () => setModalVisible(true);
    const closeEditModal = () => setModalVisible(false);

    const handleThisDay = () => {
        // logic for "this day only"
        console.log('This day only');
        setModalVisible(false);
    };

    const handleFutureDays = () => {
        // logic for "this and future days"
        console.log('This and future days');
        setModalVisible(false);
    };



    const taskStyles = isDone
        ? [styles.taskContainer, styles.done]
        : [styles.taskContainer];

    const colors = TASK_COLORS[task.type]; // will choose automatically by its type

    const fontS = pxToPt(41);
    const labelHeight = fontS * 1.2;
    // If mode == 'week', then we simply keep that shit in a View, if mode == 'day', then in a Pressable.  
    /** The color of a background will depend on a type #3d6984:
     * flexible = backgr #e1eaf3, border #3d6984, text #0d283d
     * event = backgr #0d283d, border #3d6984, text #e1eaf3
     * template = backgr #3d6984, border #0d283d, text #c8d7e3 */ 

    let taskHeight = 100; // default
    let topStart = 0;
    if (task.start && task.end) {
        const startMinutes = timeToMinutes(task.start);
        const endMinutes = timeToMinutes(task.end);
        topStart = timeToY(startMinutes, 'current');
        const topEnd = timeToY(endMinutes, 'current');
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

    return null; // just in case
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