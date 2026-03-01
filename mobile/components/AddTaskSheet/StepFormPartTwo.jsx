import { View, Text, StyleSheet, Pressable, TextInput, Platform, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import font from '../../constants/typography.js';
import { useContext, useEffect, useState } from 'react';
import { AddNewContext } from '../../context/AddNewContext.js';
import DateTimePicker from '@react-native-community/datetimepicker';
import {MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Switch } from 'react-native';
import SelectAdditional from '../ui/SelectAdditional.jsx';
import InfoLabel from '../ui/InfoLabel.jsx';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { REMINDER_OFFSET, REST_TIME } from '../../constants/services.js';
import { AuthContext } from '../../context/AuthContext.js';
import { buildTaskRequest, handleCreateTask } from '../../utils/addNew.js';



export default function StepFormPartTwo() {
  const { common, setCommon,  newTask, setNewTask, template, createTask, resetForm, utils, setUtils } = useContext(AddNewContext);
  const { token } = useContext(AuthContext);
  
  const clampEndDate = (start, end) => {
    if (end <= start) {
      return new Date(start.getTime() + 15 * 60000);
    }
    return end;
  };

  useEffect(() => {
    if (!utils.useSchedule) {
      // выключили schedule → обнуляем даты
      setNewTask(prev => ({
        ...prev,
        startDatetime: null,
        endDatetime: null,
      }));
      return;
    }

    // включили schedule → если дат нет, создаём
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

  useEffect(() => {
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

    const diff =
      (end.getTime() - start.getTime()) / 60000;

    setNewTask(prev => ({
      ...prev,
      estimatedTime: diff,
    }));

  }, [
    newTask.startDatetime,
    newTask.endDatetime,
    utils.useSchedule,
  ]);


  useEffect(() => {
    if (utils.useSchedule) return;
    if (!newTask.startDatetime) return;

    const start = new Date(newTask.startDatetime);

    const end = new Date(
      start.getTime() + newTask.estimatedTime * 60000
    );

    setNewTask(prev => ({
      ...prev,
      endDatetime: end.toISOString(),
    }));

  }, [
    newTask.estimatedTime,
    newTask.startDatetime,
    utils.useSchedule,
  ]);



  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: '#a7bdd2' }}
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={20}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>
        {common.taskType?.replace('_', ' ') || 'New Task'}
      </Text>
      
      <View style={{ width: '90%', flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom: 10, }}>
        <InfoLabel
          label="schedule task"
          info="Optional. If turned off, the task will be added to the tasks pool on the home page. Such tasks can be scheduled automatically."
          // infoTitle='Schedule Task'
          textStyle={[
          styles.title2,
          { opacity: utils.useSchedule ? 1 : 0.5 }]}
        />
       
        <Switch
        style={{ marginTop: 6 }}
          value={utils.useSchedule}
          onValueChange={val => 
            setUtils(prev => ({...prev, useSchedule: val}))
          }
        />
      </View>
      
        {/* DATETIMES CONTAINER */}
        <View 
          pointerEvents={utils.useSchedule ? 'auto' : 'none'}
          style={{
            gap: 10, 
            width: '90%', 
            marginBottom: 30,
            opacity: utils.useSchedule ? 1 : 0.5,
            }}>
              
          {/* DATETIME START */}
          <View style={{ flexDirection: 'row', alignContent: 'center'}}>
            <Text style={[ styles.title2, {alignSelf: 'flex-start', fontFamily: font.Mregular, fontSize: 20}]}>start:</Text>
            
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
          <View style={{ flexDirection: 'row'}}>
            <Text style={[ styles.title2, {alignSelf: 'flex-start',fontFamily: font.Mregular, fontSize: 20 }]}>
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
      
      <View style={{ flexDirection: 'row', }}>
        <SelectAdditional myPlaceholder={'Reminder'} newTaskProperty={'reminderOffset'} options={REMINDER_OFFSET}/>
        <SelectAdditional iconFAname='hourglass-start' myPlaceholder={'Rest Time'} newTaskProperty={'restTime'} options={REST_TIME}/>
      </View>

      
      {/* ESTIMATED TIME */}
      <View 
      pointerEvents={!utils.useSchedule ? 'auto' : 'none'}
      style={{
        width:'90%',
        marginVertical: 40,
        opacity: utils.useSchedule ? 0.5 : 1,
        justifyContent: 'center', 
        alignItems: 'center',
      }}>
        {/* Title */}
        <Text style={styles.title2}>estimated time</Text>

        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'center', 
          width: '90%', 
          position: 'relative', 
          height: 80, 
          overflow: 'hidden',
          marginBottom: 10
        }}>
          {/* HOURS */}
          <View style={{ flex: 1, flexDirection: 'row', position: 'absolute', top: -80 }}> 
            <Picker
              selectedValue={Math.floor(newTask.estimatedTime / 60)}
              style={{ width: 100, height: 150 }}
              onValueChange={h => 
                setNewTask(prev => ({...prev,
                  estimatedTime: h * 60 + (prev.estimatedTime % 60)    
                  }))
              }
            >
              {[0,1,2,3,4,5].map(h => (
                <Picker.Item key={h} label={`${h} h`} value={h} />
              ))}
            </Picker>

          {/* MINUTES */}
            <Picker
              selectedValue={newTask.estimatedTime % 60}
              style={{ width: 120, height: 150 }}
              onValueChange={m =>
                setNewTask(prev => ({
                  ...prev,
                  estimatedTime: Math.floor(prev.estimatedTime / 60) * 60 + m
                }))
              }
            >
              {Array.from({ length: 60 }, (_, i) => i)
                .filter(m => {
                  const hours = Math.floor(newTask.estimatedTime / 60);
                  if (hours === 5) return m === 0;        // max 5h = 0m
                  if (hours === 0) return m >= 15;        // min 15m for 0h
                  if (newTask.estimatedTime > 300 && !utils.useSchedule)  setNewTask(prev => ({ ...prev, estimatedTime: 300 })); // bcs the diff between dates and estimated can be more than 5h. So we need to prevent 0h 0m case on the picker

                  return true;                         // others have all 0-60
                })
                .map(m => (
                  <Picker.Item key={m} label={`${m} m`} value={m} />
                ))}
            </Picker>
          </View>
        </View>

        {/* Slider */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: '#c8d7e3', fontFamily: font.Mregular, fontSize: 15}}>0h</Text>
          <Slider
            style={{ flex: 1, marginHorizontal: 10 }}
            minimumValue={15}
            maximumValue={300} // 5 hours
            step={15}
            value={newTask.estimatedTime}
            onValueChange={val =>
                  setNewTask(prev => ({ ...prev, estimatedTime: val }))
              }
            minimumTrackTintColor="#394c60"
            maximumTrackTintColor="#c8d7e3"
          />
          <Text style={{ color: '#c8d7e3', fontFamily: font.Mregular, fontSize: 15}}>5h</Text>
        </View>
      </View>
      
      {/* DESCRIPTION */}
      <View style={{ width: '90%', marginBottom: 20 }}>
        <Text style={[ styles.title2, { textAlign: 'left' }]}>description</Text>

        <TextInput
          style={styles.descriptionInput}
          placeholder="Add task description..."
          placeholderTextColor="#6b8798"
          multiline
          scrollEnabled
          returnKeyType="done"
          textAlignVertical="top"
          value={common.description || ''}
          onChangeText={text =>
            setCommon(prev => ({ ...prev, description: text }))
          }
        />
      </View>

      {/* NEXT & PREV buttons */}
      <View style={{flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <Pressable
          style={ styles.backButton }
          onPress={() => setUtils(prev => ({ ...prev, step: prev.step - 1 }))}
        >
          <Text style={styles.backText}>BACK</Text>
        </Pressable>
          <Pressable
            style={[styles.completeButton]}
            onPress={async () => {
              const taskData = buildTaskRequest(common, newTask, template);
              const result = await handleCreateTask(createTask, token, taskData);
              
              Alert.alert(result.message.title, result.message.body);

              if (result.code === 200) {
                setUtils(prev => ({ ...prev, step: 1 }));
                resetForm();
              }
            }}
          >
          <MaterialIcons name="done" size={50} color={"#394c60"} />
        </Pressable>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, 
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

  descriptionInput: {
    width: '100%',
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    fontFamily: font.Mregular,
    fontSize: 18,
    letterSpacing: 1.2,
    color: '#394c60',
  },

  backButton: {
    alignSelf: 'flex-end'
  },
  completeButton: {
    alignSelf: 'flex-end'
  },
  backText: {
    color: '#fff',
    fontSize: 30,
    letterSpacing: 1.4,
    color: '#3c6674',
    fontFamily: font.Mregular,
  },
});



