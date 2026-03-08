import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useContext } from "react";
import { AddNewContext } from "../../../context/AddNewContext";
import font from "../../../constants/typography";
import { PRIORITY_COLORS } from "../../../constants/theme";

export default function Priority() {
    const {newTask, setNewTask} = useContext(AddNewContext);

    return (
        // Priority
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
                    priority
                    }))
                }
                />
                ))}
            </View>

            <Image
                source={require('../../../assets/images/priorityArrow.png')}
                style={ styles.priorityArrow }
                resizeMode="contain"
                />
        </View>
    )
};

const styles = StyleSheet.create({
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
    borderRadius: '25%',
  },
  prioritySelected: {
    borderWidth: 3,
    borderColor: '#fff',
  },
})
