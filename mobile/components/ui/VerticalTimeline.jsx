import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { pxToPt } from '../../utils/scale';
import font from '../../constants/typography';

// props:
// minTime: number of hours to start (e.g. 7 for 7:00 AM)
// maxTime: number of hours to end (e.g. 22 for 10:00 PM)
// stepHours: step between markers (e.g. 3)
// pxPerHour: number of pixels per hour
export default function VerticalTimeline({
  minTime = 6,
  maxTime = 21,
  stepHours = 3,
}) {

// default is gonna be from 6am to 9pm
  // Generating time marks
  const timeLabels = useMemo(() => {
    const labels = [];
    for (let t = minTime; t <= maxTime; t += stepHours) {
      const hour = Math.floor(t);
      // const minute = Math.round((t - hour) * 60);
      const hh = hour.toString().padStart(2, '0');
      // const mm = minute.toString().padStart(2, '0');
      const mm = "00";
      labels.push(`${hh}:${mm}`);
    }
    return labels;
  }, [minTime, maxTime, stepHours]);

  return (
      <View style={{height: '100%', flexDirection: 'row', backgroundColor: ''}}>
     
        {/* Метки времени */}
        <View style={styles.labels}>
          {timeLabels.map((label, idx) => (
              <Text key={idx} style={[styles.labelText]}
            //   { top: (idx * 49) }
            >
              {label}
            </Text>
          ))}
        </View>
        <View style={styles.separatorLine}/>
      </View>
  );
}

const styles = StyleSheet.create({
  separatorLine: {
    width: 2,
    backgroundColor: '#8aa7bc',
    height: '100%',
    marginHorizontal: 5,
},

  labels: {
    justifyContent: 'space-between',
    paddingTop: 30,
    // paddingVertical: 5,
},
labelText: {
    fontSize: pxToPt(50),
    color: '#0d283d',
    fontFamily: font.Mregular,
    textTransform: 'uppercase',
  },
});
