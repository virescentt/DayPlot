import { View, Text, StyleSheet, Pressable } from 'react-native';
import { pxToPt } from '../utils/scale.js';
import { router } from 'expo-router';
import font from '../constants/typography.js';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text>Home page</Text>
      <Pressable
      onPress={() => router.replace('/login')}>
        <Text style={{textDecorationLine: 'underline', fontFamily: font.Mbold, marginTop: 100}}>Log out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center', 
  }
}
) 