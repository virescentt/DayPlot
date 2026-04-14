import { Pressable, View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native"
import { TaskPoolButton } from "./TaskPoolButton"
import font from "../../constants/typography";
import { pxToPt } from "../../utils/scale";
import { Ionicons } from '@expo/vector-icons';
import { useContext, useEffect } from "react";
import { TimeLimitsContext } from "../../context/TimeLimitsContext";
import { router } from "expo-router";
import { SelectedTaskContext } from "../../context/SelectedTaskContext";
import { fetchPoolTasks } from "../../services/tasks";
import { TasksContext } from "../../context/TasksContext";


export default function StatsTaskPoolBtn({ mode }) {
    const {stats, scheduledHours} = useContext(TimeLimitsContext)
    const { onOpenTaskPool, poolBottomSheetVisible } = useContext(SelectedTaskContext)
    const { poolTasks, loadPoolTasks } = useContext(TasksContext)

    useEffect(() => {
      loadPoolTasks();
    }, []);


    let max_hours = 0
    if (mode === 'week') { max_hours = stats['max_hours_per_week']} 
    else if (mode === 'day') { max_hours = stats['max_hours_per_day']} 

    let title = 'Week flexible stats'
    let scheduledText = 'scheduled: ' + scheduledHours + 'H'
    let limitText = 'limit: ' + max_hours + 'H'
    
    const goToSettings = () => {
      router.push('/(tabs)/profile/time');
    };

    console.log("STATSSSSS poolbtn: ", stats)

    return (
        <>
        {/* Stats & TaskPool btn */}
        <View style={ styles.container }>
            {/* Stats Container */}
            <View style={{ width: '70%', }}>
            <Pressable
                style={ styles.pressableStatsCont }
                onPress={goToSettings}
                >
                <Text style={ styles.statsText }>{title}</Text>
                <Ionicons name="pencil" size={12} color="#3c6674"/>
            </Pressable>
            <View
                style={{
                    height: 1,
                    backgroundColor: '#3c6674',
                    marginVertical: 3,
                    width: '60%',
                }}
                />
            <Text style={ styles.hoursText }>{limitText}</Text>
            <Text style={[styles.hoursText, {color: scheduledHours > max_hours ? '#b98905' : '#3c6674'}
            ]}>{scheduledText}</Text>
            </View>
            {/* TaskPoolBtn */}
            <TouchableOpacity onPress={onOpenTaskPool} style={styles.wrapper}>
              <TaskPoolButton count={poolTasks.length} opened={poolBottomSheetVisible} />
            </TouchableOpacity>
        </View>
        </>
    );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    width: '100%', 
    paddingHorizontal: 15, 
    alignItems: 'center', 
    marginBottom: 5
  },
  pressableStatsCont: {
    flexDirection: 'row',
    alignItems: 'center', 
    gap: 5, 
  },
  wrapper: {
    position: 'absolute',
    right: -12, // goes beyond the screen
    paddingVertical: 8,
    paddingLeft: 5,
    paddingRight: 26,

    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,

    backgroundColor: 'transparent',
  },
  statsText: {
    letterSpacing: 1.4,
    fontFamily: font.Mregular,
    fontSize: pxToPt(30),
    color: '#3c6674'
  },
  hoursText: {
    letterSpacing: 1.4,
    fontFamily: font.Mregular,
    textTransform: 'uppercase',
    fontSize: pxToPt(50),
    color: '#3c6674'
  },
  
})