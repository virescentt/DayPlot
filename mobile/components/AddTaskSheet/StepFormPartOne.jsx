import { View, Text, Image, StyleSheet, Pressable, TextInput, Platform, Alert } from 'react-native';
import font from '../../constants/typography.js';
import {PRIORITY_COLORS } from '../../constants/theme.js';
import { useContext, useState } from 'react';
import { AddNewContext } from '../../context/AddNewContext.js';
import DateTimePicker from '@react-native-community/datetimepicker';
import CategorySelect from '../ui/CategorySelect.jsx';
import { FontAwesome6 } from '@expo/vector-icons';

const RowInput = ({ icon, children }) => (
  <View style={styles.deadlineRow}>
      {icon}
      {children}
  </View>
);

export default function StepFormPartOne() {
  const { common, setCommon, setUtils, newTask, setNewTask, isChanged, resetForm } = useContext(AddNewContext);

  const deadline = new Date(newTask.deadline);

   const handleBack = () => {
    if (isChanged()) {
      Alert.alert(
        "Want to exit?",
        "All changes will be lost.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Exit",
            style: "destructive",
            onPress: () => {
              resetForm();
            }
          },
        ]
      );
    } else {
      resetForm();
    }
  };

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
              newTask.priority === priority && styles.prioritySelected
            ]}
            onPress={() =>
              setNewTask(prev => ({
                ...prev,
                priority: priority
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
              value={deadline}
              mode="date"
              display={Platform.OS === 'ios' ? 'default' : 'default'}
              onChange={(e, date) => {
                if (!date) return;

                const updated = new Date(newTask.deadline);

                updated.setFullYear(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate()
                )
                
                const now = new Date();
                if (updated < now) updated.setTime(now.getTime());
                
                setNewTask(prev => ({ ...prev, deadline: updated.toISOString() }));
                
              }}
            />
          </RowInput>

          {/* Deadline: Time */}

          <RowInput icon={<FontAwesome6 name="clock" size={24} color="#e1eaf3"/>}>
          {/* <Pressable onPress={() => setShowTime(true)} style={styles.dateButton}>
            <Text style={ styles.dateText }>{deadlineTime.getHours()}:{deadlineTime.getMinutes().toString().padStart(2, '0')}</Text>
          </Pressable> */}
            <DateTimePicker
              value={deadline}
              mode="time"
              is24Hour={true}
              display={Platform.OS === 'ios' ? 'default' : 'default'}
              onChange={(e, date) => {
                if (!date) return;

                const updated = new Date(newTask.deadline);

                updated.setHours(
                  date.getHours(),
                  date.getMinutes()
                )

                const now = new Date();
                if (updated < now) updated.setTime(now.getTime());

                setNewTask(prev => ({ ...prev, deadline: updated.toISOString() }));
                
              }}
            />
          </RowInput>
        </View>

      </View>

      {/* buttons back and next */}
      <View style={{flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
      
        {/* BACK button */}
        <Pressable
          style={[
            styles.nextButton,
          ]}
           onPress={handleBack}
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
          onPress={() => setUtils(prev => ({ ...prev, step: prev.step + 1 }))}
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
    fontFamily: font.Mregular,
    letterSpacing: 1.4,
    fontSize: 20,
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