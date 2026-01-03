import { View, Text, Image, StyleSheet} from 'react-native'
import { useEffect } from 'react'
import { Redirect, router } from 'expo-router';
import font from "../constants/typography.js"
import { pxToPt } from '../utils/scale.js';
import DayPlotTitle from '../components/ui/DayPlotTitle.jsx'

export default function IntroScreen() {
  let isLoggedIn = false; // потом будет реальная проверка
  
  const quotes_list = [
    "Act, don’t wait.",
    "Strength overcomes weakness.",
    "Every day is a step forward.",
    "Mistakes fuel growth.",
    "Will is enough to start.",
    "Do today, be proud tomorrow.",
    "Strive until you achieve.",
    "Decisions matter more than circumstances.",
    "Persistence breaks barriers.",
    "Your progress is your power."
  ]

  let route = '/home'
  if (!isLoggedIn) {
    route = '/login'
  }
  useEffect(
    () => {
    const timer = setTimeout(() => {
      router.replace(route);
    }, 3000);
    return () => clearTimeout(timer); 
  }, [])


  return (
    <View style={styles.container}>
      <DayPlotTitle logoStyle={styles.logo} containerStyle={styles.centerBlock} size={pxToPt(114)}  />
      <Text style={styles.quote}>{quotes_list[Math.floor(Math.random() * quotes_list.length)]}</Text>
    </View>
  );

  // return isLoggedIn
  //   ? <Redirect href="/home" />
  //   : <Redirect href="/login" />;

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,

  },
  centerBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo:
    { width: '200', height: '200', marginBottom: 20 },
  quote: {
    fontFamily: font.MIregular,
    marginBottom: 30,
    fontSize: 16,
    textAlign: 'center',
    color: '#666'
  },
});