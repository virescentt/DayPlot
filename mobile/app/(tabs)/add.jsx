import { View, Text, StyleSheet, Pressable } from 'react-native';
import { pxToPt } from '../../utils/scale.js';
import { router } from 'expo-router';
import font from '../../constants/typography.js';
import Header from '../../components/ui/Header.jsx';
import Footer from '../../components/ui/Footer.jsx';
import { Ionicons } from '@expo/vector-icons';

export default function Add() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={{flex: 1}}>
        <Text>Add tab</Text>
        <Pressable
        onPress={() => router.replace('/login')}>
          <Text style={{textDecorationLine: 'underline', fontFamily: font.Mbold, marginTop: 100}}>Log out</Text>
        </Pressable>
      </View>
      {/* <Footer /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center', 
    justifyContent: 'space-between'
  }
}
) 