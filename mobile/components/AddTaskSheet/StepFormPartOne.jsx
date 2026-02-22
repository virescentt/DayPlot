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
import { FontAwesome6 } from '@expo/vector-icons';

const RowInput = ({ icon, children }) => (
  <View style={styles.deadlineRow}>
      {icon}
      {children}
  </View>
);

export default function StepFormPartOne() {
  const { common, setCommon,  newTask, setNewTask } = useContext(AddNewContext);
  
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  // Default deadline: Now + 1h
  const defaultDeadline = new Date(Date.now() + 60 * 60 * 1000);
  const [deadlineDate, setDeadlineDate] = useState(defaultDeadline);
  const [deadlineTime, setDeadlineTime] = useState(defaultDeadline);

  console.log(newTask.priority + 'PRIORITY LEVEL DEFAULT')


  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>{common.taskType?.replace('_', ' ') || 'New Task'}</Text>

      {/* Title input */}
      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor="#394c6080"
        value={common.title}
        onChangeText={(text) => setCommon(prev => ({ ...prev, title: text }))}
      />
      <CategorySelect />

      {/* Priority */}
      <View style={ styles.priorityContainer }>
        <Text style={ styles.title2 }>priority</Text>
        <Text style={ styles.titleDescr }>From lowest to highest</Text>
        <View style={ styles.priorityImages }>
          {Object.entries(PRIORITY_COLORS).map(([priority, color]) => (
            <Pressable
            key={priority}
            style={[
              styles.priorityCircle,
              { backgroundColor: color },
              newTask.priority === Number(priority) && styles.prioritySelected
            ]}
            onPress={() =>
              setNewTask(prev => ({
                ...prev,
                priority: Number(priority)
              }))
            }
            />
          ))}
        </View>

        <Image 
          source={require('../../assets/images/priorityArrow.png')}
          style={ styles.priorityArrow }
          resizeMode="contain"
          />
      </View>

      {/* DEADLINE */}
      <View style={{ flexDirection: 'row', width: '90%', justifyContent: '' }}>
        <View style={{width: '50%'}}>
          <Text style={[ styles.title2, {alignSelf: 'flex-start'}]}>deadline</Text>
          <Text style={[ styles.titleDescr, {alignSelf: 'flex-start', textAlign: 'left'} ]}>Select by what point this task should be completed</Text>
        </View>
      
      {/* Deadline: Date */}
        <View style={{marginTop: 10}}>
          
          <RowInput icon={<FontAwesome6 name="calendar-days" size={27} color="#e1eaf3"/>}>
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
          </RowInput>

          {/* Deadline: Time */}

          <RowInput icon={<FontAwesome6 name="clock" size={24} color="#e1eaf3"/>}>
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
          </RowInput>
        </View>

      </View>

      {/* buttons back and next */}
      <View style={{flex: 1, width: '90%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
      {/* BACK button */}
        <Pressable
          style={[
            styles.nextButton,
          ]}
          onPress={() => setCommon(prev => ({ ...prev, step: prev.step - 1 }))}
        >
          <Text style={styles.nextText}>BACK</Text>
        </Pressable>
        {/* NEXT button */}
        <Pressable
          style={[
            styles.nextButton,
            !common.title && { opacity: 0.5 }  
          ]}
          disabled={!common.title}
          onPress={() => setCommon(prev => ({ ...prev, step: prev.step + 1 }))}
        >
          <Text style={styles.nextText}>NEXT</Text>
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
    gap: 3,          // RN 0.71+
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
  nextButton: {
    alignSelf: 'flex-end',
  },
  nextText: {
    color: '#fff',
    fontSize: 30,
    letterSpacing: 1.4,
    color: '#3c6674',
    fontFamily: font.Mregular,
  },
});