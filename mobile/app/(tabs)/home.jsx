import { View, Text, StyleSheet, Pressable } from 'react-native';
import { pxToPt } from '../../utils/scale.js';
import { router } from 'expo-router';
import font from '../../constants/typography.js';
import Header from '../../components/ui/Header.jsx';
import Footer from '../../components/ui/Footer.jsx';
import { Ionicons } from '@expo/vector-icons';
import { TaskPoolButton } from '../../components/ui/TaskPoolButton.jsx';
import Arrow from '../../components/ui/Arrow.jsx';
import VerticalTimeline from '../../components/ui/VerticalTimeline.jsx';

import CurrentTimeLine from '../../components/ui/CurrentTimeLine.jsx'; 

export default function Home() {
  return (
    <View style={styles.container}>
      <Header />
      {/* Main Container */}
      <View style={{flex: 1}}>

        {/* Stats & TaskPool btn */}
        <View style={{ flexDirection: 'row', width: '100%', paddingHorizontal: 15, alignItems: 'center', marginBottom: 5}}>
          {/* Stats Container */}
          <View style={{ width: '70%', }}>
            <Pressable
              style={ styles.pressableStatsCont }
            >
              <Text style={ styles.statsText }>Week flexible stats</Text>
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

        {/* Data & Date Badge Container */}
        <View style={{flex: 1, backgroundColor: '#a7bdd2', borderRadius: 8}}>

          {/* Date Badge */}
          <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 10}}>
              <CurrentTimeLine />

              {/* <Ionicons name="arrow-back-outline" size={12} color="#3c6674"/> */}
              <Arrow length={20} thickness={2} direction="left" />
              <Text style={ styles.dateText }>
                28 dec — 4 jun {"\t"}
                <Text style={ [styles.currentText, { paddingLeft: 8 }]}>current</Text>
              </Text>
              <Arrow length={20} thickness={2} direction="right" />
          </View>

          {/* Data Container */}
          <View style={{ flex: 1, flexDirection: 'row', marginBottom: 10, paddingHorizontal: 10, backgroundColor: ''}}>
            <VerticalTimeline />
          </View>

        </View>

      </View>
      {/* <Footer /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between'
    },
  UpperText: {
    textTransform: 'uppercase'
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
  dateText: {
    letterSpacing: 1.4,
    fontFamily: font.Bregular,
    textTransform: 'uppercase',
    fontSize: pxToPt(50),
    color: '#3c6674',
    marginLeft: 10,
    marginRight: 10,
    
  },
  currentText: {
    textDecorationLine: 'underline',
    color: '#e1eaf3'
  },
  pressableStatsCont: {
    flexDirection: 'row',
    alignItems: 'center', 
    gap: 5, 
  },

  currentLine: {
    
  },

}) 