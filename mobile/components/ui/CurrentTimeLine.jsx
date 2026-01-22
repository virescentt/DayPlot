import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { pxToPt } from '../../utils/scale';
import font from '../../constants/typography';


export default function CurrentTimeLine({ minTime = 6, maxTime = 21, pxPerHour = 36.7 }) {
  const now = new Date();
  let currentHour =
    now.getHours() + now.getMinutes() / 60;
  currentHour = 6

  const top = (currentHour - minTime);
  const maxHeight = (maxTime - minTime) * pxPerHour;

  if (top < 0 || top > maxHeight) return null;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.currentLine,
        { top }
      ]}
    />
  );
}

const styles = StyleSheet.create({
  currentLine: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#ff3b30',
    zIndex: 999,
  },
});