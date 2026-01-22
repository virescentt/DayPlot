import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { pxToPt } from '../../utils/scale';
import font from '../../constants/typography';

const fontS = pxToPt(45);
const paddingTopLabels = 30;
const paddingBottomLabels = 20;

export default function VerticalTimeline({
  height,
  minTime = 6,
  maxTime = 21,
  stepHours = 3,
}) {
  let start = minTime * 60;
  const step = stepHours * 60;

  // round up to the nearest multiple of step from start
  const maxMinutes = maxTime * 60;
  const remainder = (maxMinutes - start) % step;

  let end = remainder === 0 ? maxMinutes : maxMinutes + (step - remainder);

  // If we got end time over 24 hours - adjusting 
  if (end > 1440) {
    start -= end - 1440 
    end = 1440; // max 24:00
  }
  
  const times = useMemo(() => {
    const arr = [];
    for (let t = start; t <= end; t += step) arr.push(t);
    return arr;
  }, [start, end, step]);
  
  const labelHeight = (fontS * 1.2);
  const paddingLabels = paddingBottomLabels + paddingTopLabels; 
  const usableHeight = Math.floor(height) - (labelHeight * times.length) - paddingLabels;
  
  const timeToY = (time) =>
    ((time - start) / (end - start)) * usableHeight;

  return (
      <View style={ styles.container }>
        
        <View style={styles.labels}>
          {times.map((time, idx) => {
            const hh = String(Math.floor(time / 60)).padStart(2, '0');
            
            return (
              <Text
              key={idx}
              style={[
                styles.labelText,
                { top: timeToY(time)},
              ]}
              >
                {hh}:00
              </Text>
            );
          })}

        </View>
      <View style={styles.separatorLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  
  labels: {
    paddingTop: paddingTopLabels,
    paddingBottom: paddingBottomLabels
  },

  labelText: {
    fontSize: fontS,
    color: '#0d283d',
    fontFamily: font.Mregular,
    textTransform: 'uppercase',
  },

  separatorLine: {
    width: 2,
    backgroundColor: '#8aa7bc',
    marginHorizontal: 5,
  },
});


// import React, { useState, useMemo } from 'react';
// import { View, Text, ScrollView, StyleSheet } from 'react-native';
// import { pxToPt } from '../../utils/scale';
// import font from '../../constants/typography';

// // props:
// // minTime: number of hours to start (e.g. 7 for 7:00 AM)
// // maxTime: number of hours to end (e.g. 22 for 10:00 PM)
// // stepHours: step between markers (e.g. 3)
// // pxPerHour: number of pixels per hour
// export default function VerticalTimeline({
//   minTime = 6,
//   maxTime = 21,
//   stepHours = 3,
// }) {

// // default is gonna be from 6am to 9pm
//   // Generating time marks
//   const timeLabels = useMemo(() => {
//     const labels = [];
//     for (let t = minTime; t <= maxTime; t += stepHours) {
//       const hour = Math.floor(t);
//       // const minute = Math.round((t - hour) * 60);
//       const hh = hour.toString().padStart(2, '0');
//       // const mm = minute.toString().padStart(2, '0');
//       const mm = "00";
//       labels.push(`${hh}:${mm}`);
//     }
//     return labels;
//   }, [minTime, maxTime, stepHours]);

//   return (
//       <View style={{height: '100%', flexDirection: 'row', backgroundColor: ''}}>
     
//         {/* Метки времени */}
//         <View style={styles.labels}>
//           {timeLabels.map((label, idx) => (
//               <Text key={idx} style={[styles.labelText]}
//             //   { top: (idx * 49) }
//             >
//               {label}
//             </Text>
//           ))}
//         </View>
//         <View style={styles.separatorLine}/>
//       </View>
//   );
// }

// const styles = StyleSheet.create({
//   separatorLine: {
//     width: 2,
//     backgroundColor: '#8aa7bc',
//     height: '100%',
//     marginHorizontal: 5,
// },

//   labels: {
//     justifyContent: 'space-between',
//     paddingTop: 30,
//     // paddingVertical: 5,
// },
// labelText: {
//     fontSize: pxToPt(50),
//     color: '#0d283d',
//     fontFamily: font.Mregular,
//     textTransform: 'uppercase',
//   },
// });
