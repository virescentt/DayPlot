import { StyleSheet, Text, View } from "react-native";
import { useContext } from "react";
import { AddNewContext } from "../../../context/AddNewContext";
import font from "../../../constants/typography";
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";

export default function EstimatedTime() {
  const {newTask, setNewTask, utils } = useContext(AddNewContext);

  return (
    // ESTIMATED TIME
    <View 
        pointerEvents={!utils.useSchedule ? 'auto' : 'none'}
        style={[ styles.estimatedTimeContainer, {
            opacity: utils.useSchedule ? 0.5 : 1,
        }]}
    >
        {/* Title */}
        <Text style={styles.title2}>estimated time</Text>

        <View style={ styles.pickersCont }>
            {/* HOURS */}
            <View style={ styles.pickers2Cont }> 
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
        <View style={ styles.sliderCont }>
            <Text style={ styles.sliderLabels }>0h</Text>
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
            <Text style={ styles.sliderLabels }>5h</Text>
        </View>
    </View>
    )
};

const styles = StyleSheet.create({
  estimatedTimeContainer: {
    width:'90%',
    marginVertical: 40,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  title2: {
    textAlign: 'center',
    color: '#3c6674',
    letterSpacing: 1.4,
    fontFamily: font.Bregular,
    fontSize: 40,
    textTransform: 'uppercase',
  },
  pickersCont: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    width: '90%', 
    position: 'relative', 
    height: 80, 
    overflow: 'hidden',
    marginBottom: 10
  },
  pickers2Cont: {
    flex: 1, 
    flexDirection: 'row', 
    position: 'absolute', 
    top: -80, 
  },
  sliderCont: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  sliderLabels: {
    color: '#c8d7e3', 
    fontFamily: font.Mregular, 
    fontSize: 15
  }
})
