import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { pxToPt } from '../../utils/scale';
import font from '../../constants/typography';


export default function CurrentTimeLine({ timeToY, isLineVisible, labelHeight, paddingTopLabels}) {
   const [currentMinutes, setCurrentMinutes] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentMinutes(now.getHours() * 60 + now.getMinutes());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  // 360
  // 540
  // 720
  // 900
  // 1080
  // 1260
  if (!isLineVisible(currentMinutes)) {
    return null;
  } else {
      const top = timeToY(currentMinutes, "current") + paddingTopLabels + (labelHeight - 1)/2;
      return (
        <>
        <View
          pointerEvents="none"
          style={[
            styles.currentLine,
            { top }
          ]}
        >
        </View>
        {/* <Text>
          {Math.floor(timeToY(currentMinutes, 'current'))}{'\t'}
        </Text> */}
        {/* <View>
          
          <Text>{currentMinutes}</Text>
        </View> */}
        </>
      );
    }
  }

const styles = StyleSheet.create({
  currentLine: {
    position: 'absolute',
    left: 55,
    right: 0,
    height: 1,
    backgroundColor: '#ff3b30',
    zIndex: 999,
  },
});