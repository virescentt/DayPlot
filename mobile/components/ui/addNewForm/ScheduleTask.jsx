import { Platform, StyleSheet, Text, View } from "react-native";
import { useContext, useEffect } from "react";
import { AddNewContext } from "../../../context/AddNewContext";
import font from "../../../constants/typography";
import { Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LayoutAnimation } from 'react-native';
import InfoLabel from "../InfoLabel";
import { TASK_LABELS } from "../../../constants/theme";

export default function ScheduleTask({ info = "Optional. If turned off, the task will be added to the Tasks Pool on the home page. Such tasks can be scheduled automatically." }) {
  const {common, newTask, setNewTask, utils, setUtils} = useContext(AddNewContext);
  
  useEffect(() => {
    if (TASK_LABELS[common.taskType] === 'planned') {
        setUtils(prev => ({ ...prev, useSchedule: true }));
    }
  }, [common.taskType]);

  // handles switcher logic on/off   
  useEffect(() => {
    // schedule off → reset dates
    if (!utils.useSchedule) {
      setNewTask(prev => ({
        ...prev,
        startDatetime: null,
        endDatetime: null,
      }));

      return;
    }

    // schedule on → if no dates, creating them.
    // Estimated time resets to 15 min.
    setNewTask(prev => {
      if (prev.startDatetime && prev.endDatetime) return prev;

      const start = new Date();
      const end = new Date(start.getTime() + 15 * 60000);

      return {
        ...prev,
        startDatetime: start.toISOString(),
        endDatetime: end.toISOString(),
        estimatedTime: 15,
      };
    });
  }, [utils.useSchedule]);

  // validates: end must be > start. 
  // Estimated time resets to 15 min.
  useEffect(() => {
    // Go further if schedule is on and there are both start/end datetimes. 
    if (!utils.useSchedule) return;
    if (!newTask.startDatetime || !newTask.endDatetime) return;

    const start = new Date(newTask.startDatetime);
    const end = new Date(newTask.endDatetime);
  
    if (end <= start) {
        const fixed = new Date(start.getTime() + 15 * 60000);

        setNewTask(prev => ({
            ...prev,
            endDatetime: fixed.toISOString(),
            estimatedTime: 15,
        }));
    
        return;
    }
  
    const diff = (end.getTime() - start.getTime()) / 60000;
    const cappedDiff = Math.min(diff, 300); // max 5 hr
    setNewTask(prev => ({
        ...prev,
        estimatedTime: cappedDiff,
    }));
  
  }, [
      newTask.startDatetime,
      newTask.endDatetime,
      utils.useSchedule,
  ]);

  return (
    <>
        {/* SCHEDULE TASK SWITCHER */}
        <View style={ styles.titleContainer }>
        <InfoLabel
            label="schedule task"
            info={info}
            // infoTitle='Schedule Task'
            textStyle={[
            styles.title2,
            { opacity: utils.useSchedule ? 1 : 0.5 }]}
        />
        
        <Switch
        style={{ marginTop: 6 }}
            value={utils.useSchedule}
            disabled={TASK_LABELS[common.taskType] === 'planned'}
            onValueChange={val => {
                if (TASK_LABELS[common.taskType] === 'planned') return;

                LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut
                );

                setUtils(prev => ({...prev,
                useSchedule: val
                }));
            }}
        />
        </View>
        
        {/* DATETIMES CONTAINER */}
        {utils.useSchedule && (
            <View style={ styles.dateTimesContainer }>
                
                {/* DATETIME START */}
                <View style={ styles.dateTimeCont }>
                    <Text style={ styles.startEndText }>
                        start:
                    </Text>
                    
                    {/* Start: Date */}
                    <DateTimePicker
                    value={newTask.startDatetime ? new Date(newTask.startDatetime) : new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'compact' : 'default'}
                    onChange={(e, date) => {
                        if (!date) return;

                        const updated = new Date(newTask.startDatetime);

                        updated.setFullYear(
                            date.getFullYear(),
                            date.getMonth(),
                            date.getDate()
                        );

                        setNewTask(prev => ({ ...prev, startDatetime: updated.toISOString() }));
                    }}
                    />
                        
                    {/* Start: Time */}
                    <DateTimePicker
                    value={newTask.startDatetime ? new Date(newTask.startDatetime) : new Date()}
                    mode="time"
                    is24Hour
                    display={Platform.OS === 'ios' ? 'compact' : 'default'}
                    onChange={(e, time) => {
                        if (!time) return;

                        const updated = new Date(newTask.startDatetime);
 
                        updated.setHours(
                            time.getHours(), 
                            time.getMinutes()
                        );

                        setNewTask(prev => ({ ...prev, startDatetime: updated.toISOString() }));
                    }}
                        />
                </View>

                {/* DATETIME END */}
                <View style={ styles.dateTimeCont }>
                    <Text style={ styles.startEndText }>
                        end:
                    </Text>
                
                    {/* End: Date */}
                    <DateTimePicker
                        value={
                        newTask.endDatetime
                            ? new Date(newTask.endDatetime)
                            : newTask.startDatetime
                            ? new Date(new Date(newTask.startDatetime).getTime() + 15 * 60000)
                            : new Date()
                        }
                        mode="date"
                        display={Platform.OS === 'ios' ? 'compact' : 'default'}
                        onChange={(e, date) => {
                        if (!date) return;

                        const updated = new Date(newTask.endDatetime);

                        updated.setFullYear(
                            date.getFullYear(),
                            date.getMonth(),
                            date.getDate()
                        );

                        setNewTask(prev => ({
                            ...prev,
                            endDatetime: updated.toISOString(),
                        }));
                        }}
                    />

                    {/* End: Time */}
                    <DateTimePicker
                        value={newTask.endDatetime ? new Date(newTask.endDatetime) : new Date()}
                        mode="time"
                        is24Hour
                        display={Platform.OS === 'ios' ? 'compact' : 'default'}
                        onChange={(e, time) => {
                        if (!time) return;

                        const updated = new Date(newTask.endDatetime);
                        
                        updated.setHours(
                            time.getHours(), 
                            time.getMinutes()
                        );

                        setNewTask(prev => ({ ...prev, endDatetime: updated.toISOString() }));
                        }}
                    />
                </View>
            </View>
        )}
    </>
    )
};

const styles = StyleSheet.create({
  titleContainer: {
    width: '90%', 
    flexDirection:'row', 
    justifyContent:'space-between', 
    alignItems:'center', 
    marginBottom: 10 
  },
  title2: {
    textAlign: 'center',
    color: '#3c6674',
    letterSpacing: 1.4,
    fontFamily: font.Bregular,
    fontSize: 40,
    textTransform: 'uppercase',
  },
  dateTimesContainer: { 
    gap: 10, 
    width: '90%', 
    marginBottom: 30 
  },
  dateTimeCont: {
    flexDirection: 'row',
    alignContent: 'center',
  },
  startEndText: { 
    color: '#3c6674',
    letterSpacing: 1.4,
    textTransform: 'uppercase', 
    alignSelf: 'flex-start', 
    fontFamily: font.Mregular, 
    fontSize: 20 
  },
  titleDescr: {
    textAlign: 'center',
    color: '#c8d7e3',
    letterSpacing: 1.4,
    fontFamily: font.Mregular,
    fontSize: 12,
  },

  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 10,
  },
})
