import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useState, useMemo, useContext } from 'react';
import Header from '../../components/ui/Header.jsx';
import VerticalTimeline from '../../components/VerticalTimeline.jsx';
import CurrentTimeLine from '../../components/ui/CurrentTimeLine.jsx'; 
import { calculateTimeline } from '../../utils/timeline.js';
import WeekDays from '../../components/WeekDays.jsx';
import StatsTaskPoolBtn from '../../components/ui/StatsTaskPoolBtn.jsx';
import DateBadge from '../../components/ui/DateBadge.jsx';
import { TasksContext } from '../../context/TasksContext.js';
import { fetchTasks } from '../../services/tasks.js';
import TaskBottomSheet from '../../components/ui/TaskBottomSheet.jsx';
import { SelectedTaskContext } from '../../context/SelectedTaskContext.js';

export default function Home() {
  const [timelineHeight, setTimelineHeight] = useState(0);
  const { loadTasks, weekStart, weekEnd, loading } = useContext(TasksContext)
  const { selectedTask } = useContext(SelectedTaskContext)
  // ----------------------------------------------------

  
  // for new tasks to appear in the timeline after refreshing it
  const onRefresh = async () => {
    if (loading) return
    await loadTasks(weekStart, weekEnd)
  }

  const { mode, minTime, maxTime } = useContext(TasksContext);
  let stepHours = 3;
  let contentHeight = 1500
  if (mode === 'day') {
    stepHours = 1;
  }

  const timelineData = useMemo(() => {
    return calculateTimeline(minTime, maxTime, stepHours, timelineHeight, mode, contentHeight);
  }, [minTime, maxTime, stepHours, timelineHeight]);

  const { 
    times, 
    timeToY, 
    isLineVisible, 
    labelHeight, 
    paddingTopLabels,
    paddingBottomLabels,
    fontS,
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
                ? { height: contentHeight }
                : { flexGrow: 1 }
            }
            onLayout={(e) => setTimelineHeight(e.nativeEvent.layout.height)}
          
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={onRefresh} 
              />
            }
          >
            <CurrentTimeLine 
              timeToY={timeToY}
              isLineVisible={isLineVisible}
              labelHeight={labelHeight}
              paddingTopLabels={paddingTopLabels}
            />
            
            <View style={{ flexDirection: 'row', flex: 1 }}>
              {/* Left column — time */}
              <VerticalTimeline
                times={times}
                timeToY={timeToY}
                fontS={fontS}
                paddingTopLabels={paddingTopLabels}
                // paddingBottomLabels={paddingBottomLabels}
              />

              {/* Right column — days + tasks */}
              <WeekDays timeToY={timeToY} />
            </View>
          </ScrollView>
        </View>
      
        {selectedTask &&
        <TaskBottomSheet 
        task={selectedTask}
        onEdit={() => {}}
        />}

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
    // backgroundColor: 'blue',
    flex: 1, 
    position: 'relative', 
    flexDirection: 'column', 
    paddingHorizontal: 10, 
    marginBottom: 10,
  },
}) 