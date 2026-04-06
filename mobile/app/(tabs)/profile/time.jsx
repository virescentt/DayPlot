import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import font from "../../../constants/typography";
import { Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TimeLimitsContext } from "../../../context/TimeLimitsContext";
import InfoLabel from "../../../components/ui/InfoLabel.jsx";
import Toast, { addMinutesHHMM, timeStrToDate, timeToMinutes } from "../../../utils/stats.js";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Slider from "@react-native-community/slider";
import { useNavigation } from "expo-router";
import { Button } from "@react-navigation/elements";
import { usePreventRemove } from "@react-navigation/native";

export default function Time() {
  const {stats, setStats, statsBefore, onSave} = useContext(TimeLimitsContext);
  const [toastVisible, setToastVisible] = useState(false);  
  const navigation = useNavigation();

  const hasUnsavedChanges = JSON.stringify(stats) !== JSON.stringify(statsBefore);

  usePreventRemove(hasUnsavedChanges, ({ data }) => {
    Alert.alert(
      "Want to exit?",
      "All changes will be lost.",
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Exit', 
          style: 'destructive', 
          onPress: () => {
            setStats(statsBefore); 
            navigation.dispatch(data.action); 
          } 
        }
      ]
    );
  });  

  useEffect(() => {
    // Go further if there are both start/end times. 
    if (!stats.sleep_start || !stats.sleep_end) return;
    
    const startMin = timeToMinutes(stats.sleep_start);
    const endMin = timeToMinutes(stats.sleep_end);

    let diff = endMin - startMin;
    if (diff <= 0) diff += 24 * 60; // adding a day, if endMin is "less" than startMin

    console.log("startMin: ", startMin)
    console.log("endMin: ", endMin)
    if (diff > 720 || diff <= 0) {
        setToastVisible(true);
        
        let newEnd = addMinutesHHMM(stats.sleep_start, 480);
        setStats(prev => ({ ...prev, sleep_end: newEnd }));

        setTimeout(() => setToastVisible(false), 4000);
    }
  }, [
      stats.sleep_start,
      stats.sleep_end,
  ]);

  return (
    <KeyboardAwareScrollView
        style={{ backgroundColor: '#a7bdd2' }}
        contentContainerStyle={styles.container}
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
        {/* SCHEDULE TASK SWITCHER */}
        <Text style={styles.title2}>Sleep Time</Text>
        <View style={ styles.titleContainer }>
          <InfoLabel
              label="Include Template hours"
              info={"Templates can reflect work/school hours. This takes up most of the day's hours. If you don't want to include template task time in your daily hours counter, you can turn it off for convenience."}
              iconColor='#3c6674'
              textStyle={[
              styles.title3,
              { opacity: stats.use_template_hours ? 1 : 0.5 }]}
          />
        
          <Switch
          style={{ marginTop: 6,transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }]}}
              value={stats.use_template_hours}
              onValueChange={val => {
                  setStats(prev => ({...prev,
                  use_template_hours: val
                  }));
              }}
              
          />

        <Toast message="Do not sleep more than 12hr a day." visible={toastVisible} />
        
        </View>
        
        {/* TIMES CONTAINER */}
        <View style={ styles.dateTimesContainer }>
            
            {/* SLEEPTIME START */}
            <View style={ styles.dateTimeCont }>
                <Text style={ styles.startEndText }>
                    sleep start:
                </Text>
                
                {/* Start: Time */}
                <DateTimePicker
                value={timeStrToDate(stats.sleep_start)}
                mode="time"
                is24Hour="false"
                display={Platform.OS === 'ios' ? 'compact' : 'default'}
                onChange={(e, time) => {
                    if (!time) return;

                    const h = time.getHours();
                    const m = time.getMinutes();

                    const formattedTime = `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}`;
                    
                    setStats((prev) => ({...prev, sleep_start: formattedTime}));
                  }
                }
                />
            </View>

            {/* SLEEPTIME END */}
            <View style={ styles.dateTimeCont }>
                <Text style={ styles.startEndText }>
                    sleep end:
                </Text>
            
                {/* End: Time */}
                <DateTimePicker
                value={timeStrToDate(stats.sleep_end)} 
                mode="time"
                is24Hour="false"
                display={Platform.OS === 'ios' ? 'compact' : 'default'}
                onChange={(e, time) => {
                  if (!time) return;

                  const h = time.getHours();
                  const m = time.getMinutes();

                  const formattedTime = `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}`;
                  
                  setStats((prev) => ({...prev, sleep_end: formattedTime}));
                  }
                }
                />
            </View>
        </View>

            {/* MAX PER DAY/WEEk */}
            <View>
              <Text style={[styles.title2, {marginTop: 20, marginBottom: 5}]}>max hours</Text>
              {/* Max hours per day */}
              <Text style={styles.title3}>Max hours per day: {stats.max_hours_per_day}</Text>
              <Slider
                minimumValue={1}
                maximumValue={12}
                step={1}
                value={stats.max_hours_per_day}
                onValueChange={val => setStats(prev => ({ ...prev, max_hours_per_day: val }))}
              />

              {/* Max hours per week */}
              <Text style={styles.title3}>Max hours per week: {stats.max_hours_per_week}</Text>
              <Slider
                minimumValue={5}
                maximumValue={80}
                step={1}
                value={stats.max_hours_per_week}
                onValueChange={val => setStats(prev => ({ ...prev, max_hours_per_week: val }))}
              />
            </View>
            {/* SAVE BUTTON */}
          <View style={{ marginTop: 30 }}>
            <Button title="Save" onPress={onSave} color="#0d536d"><Text style={{color: 'white', fontFamily: font.Mregular, fontSize: 18}}>Save</Text></Button>
          </View>

    </KeyboardAwareScrollView>
    )
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#a7bdd2',
    alignItems: 'left',
    padding: 20,
    flex: 1,
  },
  titleContainer: {
    flexDirection:'row', 
    justifyContent:'space-between', 
    alignItems:'center', 
    marginBottom: 10 
  },
  title2: {
    textAlign: 'left',
    color: '#3c6674',
    letterSpacing: 1.4,
    fontFamily: font.Bregular,
    fontSize: 40,
    textTransform: 'uppercase',
  },
  title3: {
    textAlign: 'left',
    color: '#3c6674',
    letterSpacing: 1.4,
    fontFamily: font.Mregular,
    fontSize: 18,
    textTransform: 'capitalize',
  },
  dateTimesContainer: { 
    gap: 10, 
    width: '90%', 
    marginBottom: 30 
  },
  dateTimeCont: {
    flexDirection: 'row',
  },
  startEndText: { 
    color: '#3c6674',
    letterSpacing: 1.4,
    textTransform: 'capitalize', 
    alignSelf: 'flex-start', 
    fontFamily: font.Mregular, 
    fontSize: 18 
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
