import { View, Text, StyleSheet } from 'react-native';
import font from '../../constants/typography';
import { pxToPt } from '../../utils/scale';
import { TransitionPresets } from '@react-navigation/bottom-tabs';


export default function Task({ tasks, taskType, mode, timeToY }) {
    const fontS = pxToPt(41);
    const labelHeight = fontS * 1.2;
    // Если mode == 'week', тогда мы эту хуетень просто во view держим, если mode == 'day', должны в pressable.  
    /** Цвет бекграунда будет зависить от типа задачи #3d6984:
     * flexible = фон #e1eaf3, обводка #3d6984, текст #0d283d
     * event = фон #0d283d, обводка #3d6984, текст #e1eaf3
     * template = фон #3d6984, обводка #0d283d, текст #c8d7e3 */ 



    const start = 420;
    const end = 960;
    const topStart = timeToY(start, 'current');
    const topEnd = timeToY(end, 'current') + 6;
    const taskHeight = topEnd - topStart;

    return (
        <>
        <View style={[styles.taskContainer, {height: taskHeight, 
            top: topStart,
            backgroundColor: '#3d6984',
            borderColor: '#0d283d',
        }]}>

            <Text style={[styles.taskNameDay, {color: '#c8d7e3' }]}>School</Text>
        </View>
            {/* <Text>{taskHeight}</Text> */}
        </>
    );
}

const styles = StyleSheet.create({
    taskContainer: {
        width: '100%', 
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 5,
        paddingTop: 9,
    },
    taskNameDay: {
        fontFamily: font.Mregular, 
    }
})