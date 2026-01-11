import { View, Text, StyleSheet, Pressable } from 'react-native';
import { pxToPt } from '../../../utils/scale.js';
import font from '../../../constants/typography.js';
import Header from '../../../components/ui/Header.jsx';
import Footer from '../../../components/ui/Footer.jsx';

export default function Language() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>LANGUAGE</Text>

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