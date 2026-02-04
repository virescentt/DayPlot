import { Pressable, View, StyleSheet, Text } from "react-native"
import font from "../../constants/typography";
import { pxToPt } from "../../utils/scale";
import Arrow from './Arrow.jsx';
import { useContext } from "react";
import { TasksContext } from "../../context/TasksContext.js";
import { goToNextPrev } from "../../utils/tasks.js";

export default function DateBadge() {
    const { mode, selectedDay, weekDays, today, setSelectedDay, setMode, loadTasks, setWeekOffset, weekOffset} = useContext(TasksContext);
    // if mode == 'week', then weekOfset. else if (mode == 'day'), then dayofset?
    const goToCurrent = async () => {
        if (mode === "day") {
            setSelectedDay(new Date(today));
            setMode("day");
        } else if (mode === "week") {
            setWeekOffset(0);
        };
    }
    
    // displaying date range
    let dateRange = "";
    if (mode === "week" && weekDays?.length) {
        const start = weekDays[0];
        const end = weekDays[weekDays.length - 1];
        const format = (d) => `${d.getDate()} ${d.toLocaleString('en', { month: 'short' })}`;
        dateRange = `${format(start)} — ${format(end)}`;
    } else if (mode === "day" && selectedDay) {
        const d = selectedDay;
        dateRange = `${d.getDate()} ${d.toLocaleString('en', { month: 'short' })}`;
    }

    return (
    <>
    {/* Date Badge */}
    <View style={ styles.container }>

        <Pressable style={{ paddingHorizontal: 20}} onPress={() => goToNextPrev("prev", mode, setWeekOffset, setSelectedDay, selectedDay, weekDays)}>
            <Arrow length={20} thickness={2} direction="left" />
        </Pressable>
        <View style={{ flexDirection: "row", width: 200, justifyContent: "space-between"}}>
            <Text style={ styles.dateText }>
            {dateRange}
            </Text>
            <Pressable onPress={goToCurrent}>
                <Text style={[ styles.dateText, styles.currentText ]}>current</Text>
            </Pressable>
        </View>
        <Pressable style={{ paddingHorizontal: 20}} onPress={() => goToNextPrev("next", mode, setWeekOffset, setSelectedDay, selectedDay, weekDays)}>
            <Arrow length={20} thickness={2} direction="right" />
        </Pressable>
    </View>
    </>
)}

const styles = StyleSheet.create({
    container: {
        width: '100%', 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginVertical: 10
    },
    currentText: {
        textDecorationLine: 'underline',
        color: '#e1eaf3',
    },
    dateText: {
        letterSpacing: 1.4,
        fontFamily: font.Bregular,
        textTransform: 'uppercase',
        fontSize: pxToPt(50),
        color: '#3c6674',
        // marginLeft: 10,
        marginRight: 10,
    },
}) 