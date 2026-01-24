import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { pxToPt } from '../../utils/scale';
import font from '../../constants/typography';

export default function VerticalTimeline({
  times,
  timeToY,
  paddingTopLabels,
  paddingBottomLabels,
  fontS
}) {
  
  return (
      <View style={ styles.container }>
        <View style={{ paddingTop: paddingTopLabels, backgroundColor: ''}}>
          {times.map((time, idx) => {
            const hh = String(Math.floor(time / 60)).padStart(2, '0');
            
            return (
              <Text
              key={idx}
              style={[
                styles.labelText,
                {top: timeToY(time, 'vertical'), fontSize: fontS}
              ]}
              >
                <Text>
                  {/* {Math.floor(timeToY(time, 'vertical'))}{'\t'}{'\t'} */}
                  
                {hh}:00
                  </Text>
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
  
  labelText: {
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