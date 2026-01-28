import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useState, useMemo, useContext, useEffect } from 'react';
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
  
  const stepHours = 3;

  const timelineData = useMemo(() => {
    return calculateTimeline(minTime, maxTime, stepHours, timelineHeight);
  }, [minTime, maxTime, stepHours, timelineHeight]);

  // и достаём
  const { 
    times, 
    timeToY, 
    isLineVisible, 
    labelHeight, 
    paddingTopLabels,
    paddingBottomLabels,
    fontS 
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

          {/* Data Container */}
          <View
          style={ styles.dataContainer }
          onLayout={(e) => setTimelineHeight(e.nativeEvent.layout.height)}
          >
            <VerticalTimeline
              times={times}
              timeToY={timeToY}
              fontS={fontS}
              paddingTopLabels={paddingTopLabels}
              paddingBottomLabels={paddingBottomLabels}
              />
            <CurrentTimeLine 
              timeToY={timeToY}
              isLineVisible={isLineVisible}
              labelHeight={labelHeight}
              paddingTopLabels={paddingTopLabels}
            />          

            <WeekDays 
              timeToY={timeToY} 
            />

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
  dataContainer: {
    flex: 1, 
    position: 'relative', 
    flexDirection: 'row', 
    paddingHorizontal: 10, 
    backgroundColor: '', 
    marginBottom: 10,
  },
  upperText: {
    textTransform: 'uppercase'
  },  
}) 