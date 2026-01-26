import { View, Image, Text, StyleSheet, Pressable } from 'react-native'   
import { pxToPt } from '../../utils/scale.js';
import { Ionicons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Footer() {
    return (
        <View style={styles.container}>
            <Pressable
            onPress={() => router.replace('/home')}>
                <Ionicons name="home" size={40} color="#3f6884" />
            </Pressable>
            <Pressable
            onPress={() => router.replace('/addHome')}>
                {/* <Ionicons name="add" size={40} color="#3f6884" /> */}
                <Feather name="plus" size={40} color="#3f6884" />
            </Pressable>
            <Pressable
            onPress={() => router.replace('/settings')}>
                <Ionicons name="person-circle" size={40} color="#3f6884" />
            </Pressable>
        </View>
    );
}


const styles = StyleSheet.create({
  container: {
    height: pxToPt(200),
    width: '100%',
    paddingVertical: 6,
    paddingHorizontal: 40,
    marginBottom: 10,
    // borderWidth: 1,
    // borderColor: '#1a507a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    
  },
  icon: {
    color: '#3f6884',
  }
});
