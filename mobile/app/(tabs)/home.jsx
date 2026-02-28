import { View, StyleSheet, ScrollView } from 'react-native';
import { useState, useMemo, useContext } from 'react';
import Header from '../../components/ui/Header.jsx';
import VerticalTimeline from '../../components/ui/VerticalTimeline.jsx';

import CurrentTimeLine from '../../components/ui/CurrentTimeLine.jsx'; 
import { calculateTimeline } from '../../utils/timeline.js';
import WeekDays from '../../components/ui/WeekDays.jsx';
import StatsTaskPoolBtn from '../../components/ui/StatsTaskPoolBtn.jsx';
import DateBadge from '../../components/ui/DateBadge.jsx';
import { TasksContext } from '../../context/TasksContext.js';

export default function Home() {
  const [timelineHeight, setTimelineHeight] = useState(0);
  // ----------------------------------------------------

  const { mode, minTime, maxTime } = useContext(TasksContext);
  
  let stepHours = 3;
  if (mode === 'day') {
    stepHours = 1;
  }

  const timelineData = useMemo(() => {
    return calculateTimeline(minTime, maxTime, stepHours, timelineHeight, mode);
  }, [minTime, maxTime, stepHours, timelineHeight]);

  // и достаём
  const { 
    times, 
    timeToY, 
    isLineVisible, 
    labelHeight, 
    paddingTopLabels,
    paddingBottomLabels,
    fontS,
    contentHeight
  } = timelineData;

  return (
    <View style={styles.container}>
      <Header />
      {/* Main Container */}
      <View style={{flex: 1}}>

        {/* Stats & TaskPool btn */}
        <StatsTaskPoolBtn mode={mode} />

        {/* Date Badge & Data Containers */}
        <View style={{flex: 1, backgroundColor: '#a7bdd2', borderRadius: 8}}>

          <DateBadge mode={mode} />

          <ScrollView
            style={ styles.dataContainer }
            contentContainerStyle={
              mode === 'day'
                ? { height: 1500 }
                : { flexGrow: 1}
            }
            onLayout={(e) => setTimelineHeight(e.nativeEvent.layout.height)}
          >
            <CurrentTimeLine 
              timeToY={timeToY}
              isLineVisible={isLineVisible}
              labelHeight={labelHeight}
              paddingTopLabels={paddingTopLabels}
            />
            
            <View style={{ flexDirection: 'row', flex: 1 }}>
              {/* Левая колонка — время */}
              <VerticalTimeline
                times={times}
                timeToY={timeToY}
                fontS={fontS}
                paddingTopLabels={paddingTopLabels}
                paddingBottomLabels={paddingBottomLabels}
              />

              {/* Правая колонка — дни + задачи */}
                <WeekDays timeToY={timeToY} />
            </View>
          </ScrollView>
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
  dataContainer: {
    flex: 1, 
    position: 'relative', 
    flexDirection: 'column', 
    paddingHorizontal: 10, 
    marginBottom: 10,
  },
  upperText: {
    textTransform: 'uppercase'
  },  
}) 