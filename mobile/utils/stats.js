export const addMinutesHHMM = (timeStr, minutesToAdd) => {
    let [h, m] = timeStr.split(":").map(Number);
    m += minutesToAdd;
    h += Math.floor(m / 60);
    m = m % 60;
    h = h % 24; // чтобы оставалось в 0-23
    return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}`;
  };

export function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export function timeStrToDate(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  const d = new Date();
  d.setHours(h);
  d.setMinutes(m);
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d;
}


import { Animated, Text, View } from 'react-native';
import { useState, useEffect } from 'react';

export default function Toast({ message, visible, duration = 2000 }) {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: 50,
        left: '10%',
        right: '10%',
        backgroundColor: '#c88623',
        padding: 12,
        borderRadius: 8,
        opacity: fadeAnim,
        alignItems: 'center',
      }}
    >
      <Text style={{ color: 'white', textAlign: 'center' }}>{message}</Text>
    </Animated.View>
  );
}