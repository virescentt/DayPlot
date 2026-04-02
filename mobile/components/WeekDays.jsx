import { useContext, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, FlatList, PanResponder } from 'react-native';
import font from '../constants/typography';
import { pxToPt } from '../utils/scale';
import TimelineTask from './ui/TimelineTask';
import { TasksContext } from '../context/TasksContext';
import { goToNextPrev } from '../utils/tasks';

export default function WeekDays({ timeToY }) {
    const {
        visibleTasks,
        tasks,
        weekDays,
        today,
        mode,
        setMode,
        selectedDay,
        setSelectedDay,
        loadTasks,
        setWeekOffset,
        weekOffset
    } = useContext(TasksContext);

    console.log(today + "TODDDDAAAAy")
    const listRef = useRef(null);

    // scrolling to today's day 
    useEffect(() => {
      if (mode !== 'week') return;

      const todayIndex = weekDays.findIndex(
        d => d.toDateString() === today.toDateString()
      );
    
      if (todayIndex !== -1) {
        listRef.current?.scrollToIndex({
          index: todayIndex,
          animated: true,
          viewPosition: 0.5, // screen center
        });
      }
    }, [mode, weekDays]);
    
    const fontS = pxToPt(41);
    // swipes for day mode
    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 20,
        onPanResponderRelease: (_, gestureState) => {
          if (!selectedDay) return;

          if (gestureState.dx < -20) goToNextPrev("next", mode, setWeekOffset, setSelectedDay, selectedDay, weekDays);
          
          if (gestureState.dx > 20) goToNextPrev("prev", mode, setWeekOffset, setSelectedDay, selectedDay, weekDays);
        },
    });

    const onSelectDay = (dayDate) => {
        setSelectedDay(dayDate);
        setMode('day');
    };
  console.log('Tasks: ' );
  console.log(tasks);
  console.log('VisibleTasks: ');
  console.log(visibleTasks);
  
  if (mode === 'week') {
    return (
      <FlatList
        data={weekDays}
        horizontal
        ref={listRef}
        keyExtractor={(day) => day.toDateString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatList}
        getItemLayout={(_, index) => ({
          length: 150,      // element width
          offset: ((index - 1) * 170) + 12,
          index,
        })}
        renderItem={({ item: dayDate }) => (
          <Pressable
            onPress={() => onSelectDay(dayDate)}
            style={({ pressed }) => [pressed && styles.pressed]}
          >
            <View style={styles.day}>
              <Text style={[ styles.label, { fontSize: fontS },
                    dayDate.toDateString() === today.toDateString() && styles.todayText,
                ]}>
                {
                  dayDate.toDateString().slice(0, 3)}
              </Text>
              <View style={[styles.tasksContainer, 
                dayDate.toDateString() === today.toDateString() && styles.todayContainer,
              ]}>
                {visibleTasks
                  .filter(t => new Date(t.start).toDateString() === dayDate.toDateString())
                  .map(task => {
                    // console.log(`${task.type}-${task.id}`)
                    return <TimelineTask key={`${task.type}-${task.id}`} timeToY={timeToY} task={task} />
                    
        })}
              </View>
            </View>
          </Pressable>
        )}
      />
    );
  }

  // day mode
  return (
    <View {...panResponder.panHandlers} style={styles.dayViewContainer}>
      <Text style={[ styles.label, { fontSize: fontS },
              selectedDay.toDateString() === today.toDateString() && styles.todayText,
          ]}>
        {selectedDay.toDateString().slice(0, 3)}
      </Text>
      <View style={[ styles.tasksContainer, {paddingHorizontal: 5}, 
          selectedDay.toDateString() === today.toDateString() && styles.todayContainer,
      ]}
      onLayout={(e) => console.log("CHECK HEIGHT WEEKDAY: ", e.nativeEvent.layout.height)}>
        {visibleTasks.map(task => (
          <TimelineTask key={`${task.type}-${task.id}`} timeToY={timeToY} task={task} />
        ))}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
    flatList: {
        flexDirection: 'row', 
        paddingHorizontal: 12,
        gap: 10,
    },
    dayViewContainer: { 
      flex: 1,
      width: '100%',
      // backgroundColor: 'white',
      paddingHorizontal: 12,
      paddingTop: 3,
      gap: 5,
    },
    day: {
        flex: 1, 
        width: 150,
        paddingTop: 3,
        gap: 5,
    },
    label: {
        marginBottom: 5, 
        textAlign: 'center', 
        textTransform: 'uppercase', 
        fontFamily: font.Mbold, 
        color: '#394c60',
    },
    todayText: {
        color: '#e1eaf3'
    },
    todayContainer: {
        backgroundColor: '#e1eaf38a'
    },
    tasksContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#3c6674',
        borderRadius: 10,
        paddingTop: 4,
        // backgroundColor: 'red',
    },
    pressed: {
        shadowOpacity: 0.15,
        elevation: 3,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'white',
        shadowOpacity: 0.12,
        transform: [{ scale: 0.965 }]
    }

})

// const labelHeight = fontS * 1.2;
// const checkh = 3 + labelHeight + 5 + 4
{/* <Text>лейбл = {labelHeight} */}
        {/* {'\n'}
        всего (паддинг 3 над лейблом + лейбл + марджин под лейблом 5, + 4 паддинг вниз внутри таск конта) = {checkh} */}
{/* </Text> */}