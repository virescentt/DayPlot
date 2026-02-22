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


const RowInput = ({ icon, children }) => (
  <View style={styles.deadlineRow}>
      {icon}
      {children}
  </View>
);

export default function StepFormPartTwo() {
  const { common, setCommon,  newTask, setNewTask } = useContext(AddNewContext);
  
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const defaultDeadline = new Date(Date.now() + 60 * 60 * 1000);
  const [deadlineDate, setDeadlineDate] = useState(defaultDeadline);
  const [deadlineTime, setDeadlineTime] = useState(defaultDeadline);

  const [timeMinutes, setTimeMinutes] = useState(60); // 1 hour by default

  const formatTime = minutes => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>
        {common.taskType?.replace('_', ' ') || 'New Task'}
      </Text>

        {/* DATETIMES CONTAINER */}
        <View style={{ width: '90%', marginBottom: 30 }}>
              
          {/* DATETIME START */}
          <View style={{ flexDirection: 'row'}}>
            <Text style={[ styles.title2, {alignSelf: 'flex-start'}]}>start:</Text>
            
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
                  value={deadlineDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'compact' : 'default'}
                  onChange={(event, selectedDate) => {
                    setShowDate(false);
                    if (selectedDate) {
                      setDeadlineDate(selectedDate);
                      const combined = new Date(selectedDate);
                      combined.setHours(deadlineTime.getHours(), deadlineTime.getMinutes());
                      setNewTask(prev => ({ ...prev, deadline: combined.toISOString() }));
                    }
                  }}
                />
                
              {/* Start: Time */}

              {/* <Pressable onPress={() => setShowTime(true)} style={styles.dateButton}>
                <Text style={ styles.dateText }>{deadlineTime.getHours()}:{deadlineTime.getMinutes().toString().padStart(2, '0')}</Text>
              </Pressable> */}
                <DateTimePicker
                  value={deadlineTime}
                  mode="time"
                  is24Hour={true}
                  display={Platform.OS === 'ios' ? 'compact' : 'default'}
                  onChange={(event, selectedTime) => {
                    setShowTime(false);
                    if (selectedTime) {
                      setDeadlineTime(selectedTime);
                      const combined = new Date(deadlineDate);
                      combined.setHours(selectedTime.getHours(), selectedTime.getMinutes());
                      setNewTask(prev => ({ ...prev, deadline: combined.toISOString() }));
                    }
                  }}
                />
          </View>

          {/* DATETIME END */}
          <View style={{ flexDirection: 'row'}}>
            <Text style={[ styles.title2, {alignSelf: 'flex-start'}]}>
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
                value={deadlineDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'default' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowDate(false);
                  if (selectedDate) {
                    setDeadlineDate(selectedDate);
                    const combined = new Date(selectedDate);
                    combined.setHours(deadlineTime.getHours(), deadlineTime.getMinutes());
                    setNewTask(prev => ({ ...prev, deadline: combined.toISOString() }));
                  }
                }}
              />

              {/* End: Time */}

              {/* <Pressable onPress={() => setShowTime(true)} style={styles.dateButton}>
                <Text style={ styles.dateText }>{deadlineTime.getHours()}:{deadlineTime.getMinutes().toString().padStart(2, '0')}</Text>
              </Pressable> */}
              <DateTimePicker
                value={deadlineTime}
                mode="time"
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'default' : 'default'}
                onChange={(event, selectedTime) => {
                  setShowTime(false);
                  if (selectedTime) {
                    setDeadlineTime(selectedTime);
                    const combined = new Date(deadlineDate);
                    combined.setHours(selectedTime.getHours(), selectedTime.getMinutes());
                    setNewTask(prev => ({ ...prev, deadline: combined.toISOString() }));
                  }
                }}
              />

          </View>
          <Text style={[ styles.titleDescr, {alignSelf: 'flex-start', textAlign: 'left'} ]}>Optional. If turned off, the task will be added to the tasks pool on the home page. Such tasks can be scheduled automatically.</Text>
      </View>
      
      {/* ESTIMATED TIME */}
      <View style={{ width: '90%', marginVertical: 20 }}>
      {/* Заголовок */}
      <Text style={styles.title2}>estimated time</Text>

      {/* Инпут */}
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={formatTime(timeMinutes)}
        onChangeText={text => {
          const [h, m] = text.match(/\d+/g) || [0, 0];
          let total = parseInt(h) * 60 + parseInt(m);
          if (total < 15) total = 15;
          if (total > 300) total = 300;
          setTimeMinutes(total);
        }}
      />

      {/* Ползунок */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ width: 30 }}>0h</Text>
        <Slider
          style={{ flex: 1 }}
          minimumValue={15}
          maximumValue={300} // 5 часов
          step={15}
          value={timeMinutes}
          onValueChange={val => setTimeMinutes(val)}
          minimumTrackTintColor="#394c60"
          maximumTrackTintColor="#c8d7e3"
        />
        <Text style={{ width: 30 }}>5h</Text>
      </View>
    </View>

      {/* NEXT & PREV buttons */}
      <View style={{flexDirection: 'row', width: '90%', justifyContent: 'space-between'}}>
        <Pressable
          style={[
          ]}
          onPress={() => setCommon(prev => ({ ...prev, step: prev.step - 1 }))}
        >
          <Text style={styles.backText}>BACK</Text>
        </Pressable>
        <Pressable
          style={[
            styles.completeButton,
            !newTask.estimatedTime || (!startDateTime & !endDateTime) && { opacity: 0.5 }
          ]}
          disabled={!newTask.estimatedTime || (!startDateTime & !endDateTime)}
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
  },
  backText: {
    color: '#fff',
    fontSize: 40,
    letterSpacing: 1.4,
    color: '#3c6674',
    fontFamily: font.Bregular,
  },
});