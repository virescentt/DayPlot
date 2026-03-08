import { Platform, StyleSheet, Text, View } from "react-native";
import { useContext } from "react";
import { AddNewContext } from "../../../context/AddNewContext";
import font from "../../../constants/typography";
import { FontAwesome6 } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';


export const RowInput = ({ icon, children }) => (
  <View style={styles.deadlineRow}>
      {icon}
      {children}
  </View>
);

export default function Deadline() {
    const {newTask, setNewTask} = useContext(AddNewContext);
    
    const deadline = new Date(newTask.deadline);

    return (
    // DEADLINE
    <View style={ styles.deadlineContainer }>
        <View style={{width: '50%'}}>
          <Text style={[ styles.title2, {alignSelf: 'flex-start'}]}>deadline</Text>
          <Text style={[ styles.titleDescr, {alignSelf: 'flex-start', textAlign: 'left'} ]}>Select by what point this task should be completed</Text>
        </View>
      
        {/* Deadline: Date */}
        <View style={{marginTop: 10}}>
          
          <RowInput icon={<FontAwesome6 name="calendar-days" size={27} color="#e1eaf3"/>}>
          
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
    )
};

const styles = StyleSheet.create({
  deadlineContainer: {
    flexDirection: 'row', 
    width: '90%', 
    justifyContent: '',
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

  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,          // RN 0.71+
    marginBottom: 10,
  },
})



{/* <Pressable onPress={() => setShowDate(true)} style={styles.dateButton}>
    <Text style={ styles.dateText }>
        {deadlineDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        })}
    </Text>
</Pressable> */}
{/* <Pressable onPress={() => setShowTime(true)} style={styles.dateButton}>
    <Text style={ styles.dateText }>{deadlineTime.getHours()}:{deadlineTime.getMinutes().toString().padStart(2, '0')}</Text>
</Pressable> */}
{/*
  dateButton: {
    color: '#000',
    backgroundColor: '#e1eaf3',
    borderRadius: 10,
    alignItems: 'center',
  },
  
  dateText: {
    fontSize: 15,
    color: '#3d6984',
    fontFamily: font.Mregular,
    letterSpacing: 1.4,
  },
  picker: {
    width: '90%',
    height: 50,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  
*/}