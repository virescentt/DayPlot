import { View, Text, StyleSheet, Pressable } from 'react-native';
import Header from '../../../components/ui/Header.jsx';

export default function Time() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>

      <Text>TIME</Text>
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