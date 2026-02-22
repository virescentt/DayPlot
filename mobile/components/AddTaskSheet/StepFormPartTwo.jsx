import { View, Text, Image, StyleSheet, Pressable, TextInput, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import font from '../../constants/typography.js';
import { TASK_COLORS, PRIORITY_COLORS } from '../../constants/theme.js';
import { useContext, useEffect, useState } from 'react';
import { AddNewContext } from '../../context/AddNewContext.js';
import DateTimePicker from '@react-native-community/datetimepicker';
import CategorySelect from '../ui/CategorySelect.jsx';
import Icon from 'react-native-vector-icons/FontAwesome';
import Svg, { Path } from 'react-native-svg';
import StretchArrow from '../../components/ui/StretchArrow.jsx'
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Switch } from 'react-native';
import SelectAdditional from '../ui/SelectAdditional.jsx';

const RowInput = ({ icon, children }) => (
  <View style={styles.deadlineRow}>
      {icon}
      {children}
  </View>
);



export default function StepFormPartTwo() {
  const { common, setCommon,  newTask, setNewTask } = useContext(AddNewContext);
  
  // const [showDate, setShowDate] = useState(false);
  // const [showTime, setShowTime] = useState(false);

  const [useSchedule, setUseSchedule] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 60 * 60 * 1000)
  );

  const [timeMinutes, setTimeMinutes] = useState(60); // 1 hour by default


  
  const formatTime = minutes => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };
  
  const clampEndDate = (start, end) => {
  if (end <= start) {
    return new Date(start.getTime() + 15 * 60000);
  }
  return end;
};

useEffect(() => {
  if (!useSchedule) return;

  const diff =
    (endDate.getTime() - startDate.getTime()) / 60000;

  // const minutes = Math.max(15, Math.min(300, Math.round(diff / 15) * 15));

  // setTimeMinutes(minutes);

  setNewTask(prev => ({
    ...prev,
    startDatetime: startDate.toISOString(),
    endDatetime: endDate.toISOString(),
    estimatedTime: timeMinutes,
  }));

}, [startDate, endDate, useSchedule]);
useEffect(() => {
  if (useSchedule) return;

  const newEnd = new Date(startDate.getTime() + timeMinutes * 60000);

  setEndDate(newEnd);

  setNewTask(prev => ({
    ...prev,
    startDatetime: startDate.toISOString(),
    endDatetime: newEnd.toISOString(),
    estimatedTime: timeMinutes,
  }));

}, [timeMinutes, startDate, useSchedule]);



  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>
        {common.taskType?.replace('_', ' ') || 'New Task'}
      </Text>
      
      <View style={{ width: '90%', flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom: 10, }}>
        <Text style={[
          styles.title2,
          { opacity: useSchedule ? 1 : 0.5 }]}>schedule task</Text>

        <Switch
        style={{ marginTop: 6 }}
          value={useSchedule}
          onValueChange={setUseSchedule}
        />
      </View>
      
        {/* DATETIMES CONTAINER */}
        <View 
          pointerEvents={useSchedule ? 'auto' : 'none'}
          style={{
            gap: 10, 
            width: '90%', 
            marginBottom: 30,
            opacity: useSchedule ? 1 : 0.5,
            }}>
              
          {/* DATETIME START */}
          <View style={{ flexDirection: 'row', alignContent: 'center'}}>
            <Text style={[ styles.title2, {alignSelf: 'flex-start', fontFamily: font.Mregular, fontSize: 20}]}>start:</Text>
            
            {/* Start: Date */}
              {/* <Pressable onPress={() => setShowDate(true)} style={styles.dateButton}>
                <Text style={ styles.dateText }>
                  {deadlineDate.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </Text>
              </Pressable> */}
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'compact' : 'default'}
                  onChange={(e, date) => {
                    if (!date) return;

                    const updated = new Date(startDate);
                    updated.setFullYear(
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate()
                    );

                    setStartDate(updated);
                    setEndDate(prev => clampEndDate(updated, prev));
                  }}
                />
                
              {/* Start: Time */}

              {/* <Pressable onPress={() => setShowTime(true)} style={styles.dateButton}>
                <Text style={ styles.dateText }>{deadlineTime.getHours()}:{deadlineTime.getMinutes().toString().padStart(2, '0')}</Text>
              </Pressable> */}
                <DateTimePicker
                  value={startDate}
                  mode="time"
                  is24Hour
                  display={Platform.OS === 'ios' ? 'compact' : 'default'}
                  onChange={(e, time) => {
                    if (!time) return;

                    const updated = new Date(startDate);
                    updated.setHours(time.getHours(), time.getMinutes());

                    setStartDate(updated);
                    setEndDate(prev => clampEndDate(updated, prev));
                  }}
                />
          </View>

          {/* DATETIME END */}
          <View style={{ flexDirection: 'row'}}>
            <Text style={[ styles.title2, {alignSelf: 'flex-start',fontFamily: font.Mregular, fontSize: 20 }]}>
              end:
            </Text>
          
            {/* End: Date */}
              
              {/* <Pressable onPress={() => setShowDate(true)} style={styles.dateButton}>
                <Text style={ styles.dateText }>
                  {deadlineDate.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </Text>
              </Pressable> */}
              <DateTimePicker
                value={endDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'compact' : 'default'}
                onChange={(e, date) => {
                  if (!date) return;

                  const updated = new Date(endDate);
                  updated.setFullYear(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate()
                  );

                  setEndDate(clampEndDate(startDate, updated));
                }}
              />

              {/* End: Time */}

              {/* <Pressable onPress={() => setShowTime(true)} style={styles.dateButton}>
                <Text style={ styles.dateText }>{deadlineTime.getHours()}:{deadlineTime.getMinutes().toString().padStart(2, '0')}</Text>
              </Pressable> */}
              <DateTimePicker
                value={endDate}
                mode="time"
                is24Hour
                display={Platform.OS === 'ios' ? 'compact' : 'default'}
                onChange={(e, time) => {
                  if (!time) return;

                  const updated = new Date(endDate);
                  updated.setHours(time.getHours(), time.getMinutes());

                  setEndDate(clampEndDate(startDate, updated));
                }}
              />

          </View>
          <Text style={[ styles.titleDescr, {alignSelf: 'flex-start', textAlign: 'left'} ]}>Optional. If turned off, the task will be added to the tasks pool on the home page. Such tasks can be scheduled automatically.</Text>
      </View>
      
      <View style={{ flexDirection: 'row', }}>
        <SelectAdditional myPlaceholder={'Reminder'} newTaskProperty={'reminderOffset'} arrayOfValues={['None', 10, 30, 60, 1440]}/>
        <SelectAdditional iconFAname='hourglass-start' myPlaceholder={'Rest Time'} newTaskProperty={'restTime'} arrayOfValues={['None', 10, 30, 60 ]}/>
      </View>
      {/* ESTIMATED TIME */}
      <View 
      pointerEvents={!useSchedule ? 'auto' : 'none'}
      style={{
        width:'90%',
        marginVertical:20,
        opacity: useSchedule ? 0.5 : 1,
        justifyContent: 'center', 
        alignItems: 'center',
      }}>
        {/* Заголовок */}
        <Text style={styles.title2}>estimated time</Text>

        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'center', 
          width: '90%', 
          position: 'relative', // чтобы absolute внутри отсчитывался от этого
          height: 80,           // желаемая высота контейнера
          overflow: 'hidden',   // обрезаем лишнее
          marginBottom: 10
        }}>
          {/* HOURS */}
          <View style={{ flex: 1, flexDirection: 'row', position: 'absolute', top: -80 }}> 
            <Picker
              selectedValue={Math.floor(timeMinutes / 60)}
              style={{ width: 100, height: 150 }} // нативная высота Picker
              onValueChange={h => setTimeMinutes(h * 60 + (timeMinutes % 60))}
            >
              {[0,1,2,3,4,5].map(h => (
                <Picker.Item key={h} label={`${h} h`} value={h} />
              ))}
            </Picker>

          {/* MINUTES */}
            <Picker
              selectedValue={timeMinutes % 60}
              style={{ width: 120, height: 150 }}
              onValueChange={m =>
                setTimeMinutes(Math.floor(timeMinutes / 60) * 60 + m)
              }
            >
              {Array.from({ length: 60 }, (_, i) => i)
                .filter(m => {
                  const hours = Math.floor(timeMinutes / 60);
                  if (hours === 5) return m === 0;        // максимум 5ч = 0 мин
                  if (hours === 0) return m >= 15;        // минимум 15 мин при 0ч
                  return true;                             // остальные варианты все минуты
                })
                .map(m => (
                  <Picker.Item key={m} label={`${m} m`} value={m} />
                ))}
            </Picker>
          </View>
        </View>
      {/* Ползунок */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ color: '#c8d7e3', fontFamily: font.Mregular, fontSize: 15}}>0h</Text>
        <Slider
          style={{ flex: 1, marginHorizontal: 10 }}
          // style={{ marginRight: 14, marginLeft: 0 }}
          minimumValue={15}
          maximumValue={300} // 5 часов
          step={15}
          value={timeMinutes}
          // onSlidingComplete={setTimeMinutes}
          onValueChange={val => setTimeMinutes(val)}
          minimumTrackTintColor="#394c60"
          maximumTrackTintColor="#c8d7e3"
        />
        <Text style={{ color: '#c8d7e3', fontFamily: font.Mregular, fontSize: 15}}>5h</Text>
      </View>
    </View>

      {/* NEXT & PREV buttons */}
      <View style={{flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <Pressable
          style={ styles.backButton }
          onPress={() => setCommon(prev => ({ ...prev, step: prev.step - 1 }))}
        >
          <Text style={styles.backText}>BACK</Text>
        </Pressable>
        <Pressable
          style={[
            styles.completeButton,
            // !newTask.estimatedTime || (!startDate && !endDate) && { opacity: 0.5 }
          ]}
          // disabled={!newTask.estimatedTime || (!startDate && !endDate)}
          onPress={() => setCommon(prev => ({ ...prev, step: prev.step + 1 }))}
        >
          <MaterialIcons name="done" size={50} color={"#394c60"} />
        </Pressable>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a7bdd2',
    alignItems: 'center',
    padding: 20,
  },

  title: {
    textAlign: 'center',
    // marginTop: 40,
    color: '#3c6674',
    letterSpacing: 1.4,
    fontFamily: font.MIregular,
    fontSize: 40,
    marginBottom: 40,
    textTransform: 'uppercase',
  },

  title2: {
    textAlign: 'center',
    color: '#3c6674',
    letterSpacing: 1.4,
    fontFamily: font.Bregular,
    fontSize: 40,
    textTransform: 'uppercase',
  },

  titleDescr: {
    textAlign: 'center',
    color: '#c8d7e3',
    letterSpacing: 1.4,
    fontFamily: font.Mregular,
    fontSize: 12,
  },

  priorityArrow: {
    width: 120, 
    height: 30, 
    alignSelf: 'center',
  },

  input: {
    width: '90%',
    height: 50,
    // borderWidth: 1,
    // borderColor: '#888',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontFamily: font.Bregular,
    letterSpacing: 1.4,
    fontSize: 30,
    color: '#394c60',
  },
  picker: {
    width: '90%',
    height: 50,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  priorityContainer: {
    width: '90%',
    marginVertical: 40,
  },
  priorityImages: {
    flexDirection: 'row',
    marginVertical: 10,
    width: '100%',
    justifyContent: 'space-between',
  },
  priorityCircle: {
    width: 70,
    height: 70,
    borderRadius: '50%',
  },
  prioritySelected: {
    borderWidth: 3,
    borderColor: '#fff',
  },
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,          // RN 0.71+
    marginBottom: 10,
  },
  dateButton: {
    color: '#000',
    backgroundColor: '#e1eaf3',
    borderRadius: 10,
    alignItems: 'center',
  },
  // dateButton: {
  //   width: 100,
  //   padding: 12,
  //   backgroundColor: '#e1eaf3',
  //   borderRadius: 10,
  //   marginBottom: 10,
  //   alignItems: 'center',
  // },
  dateText: {
    fontSize: 15,
    color: '#3d6984',
    fontFamily: font.Mregular,
    letterSpacing: 1.4,
  },
  backButton: {
    alignSelf: 'flex-end'
  },
  completeButton: {
    alignSelf: 'flex-end'
  },
  backText: {
    color: '#fff',
    fontSize: 40,
    letterSpacing: 1.4,
    color: '#3c6674',
    fontFamily: font.Bregular,
  },
});