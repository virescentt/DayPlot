import { Pressable, View, StyleSheet, Text } from "react-native"
import { TaskPoolButton } from "./TaskPoolButton"
import font from "../../constants/typography";
import { pxToPt } from "../../utils/scale";
import { Ionicons } from '@expo/vector-icons';



export default function StatsTaskPoolBtn({ mode }) {
    const title =
        mode === 'week'
      ? 'Week flexible stats'
      : mode === 'day'
      ? 'Day flexible stats'
      : 'Flexible stats';

    return (
        <>
        {/* Stats & TaskPool btn */}
        <View style={ styles.container }>
            {/* Stats Container */}
            <View style={{ width: '70%', }}>
            <Pressable
                style={ styles.pressableStatsCont }
                >
                <Text style={ styles.statsText }>{title}</Text>
                <Ionicons name="pencil" size={12} color="#3c6674"/>
            </Pressable>
            <View
                style={{
                    height: 1,
                    backgroundColor: '#3c6674',
                    marginVertical: 3,
                    width: '60%',
                }}
                />
            <Text style={ styles.hoursText }>scheduled: 14h</Text>
            <Text style={ styles.hoursText }>limit: 20h</Text>
            </View>
            {/* TaskPoolBtn */}
            <TaskPoolButton count={9} />
        </View>
        </>
    );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    width: '100%', 
    paddingHorizontal: 15, 
    alignItems: 'center', 
    marginBottom: 5
  },
  pressableStatsCont: {
    flexDirection: 'row',
    alignItems: 'center', 
    gap: 5, 
  },
  statsText: {
    letterSpacing: 1.4,
    fontFamily: font.Mregular,
    fontSize: pxToPt(30),
    color: '#3c6674'
  },
  hoursText: {
    letterSpacing: 1.4,
    fontFamily: font.Mregular,
    textTransform: 'uppercase',
    fontSize: pxToPt(50),
    color: '#3c6674'
  },
  
})