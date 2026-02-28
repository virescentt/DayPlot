import { View, Text, StyleSheet } from 'react-native';
import Header from '../../../components/ui/Header.jsx';

export default function Faq() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>FUCK YOU ❤</Text>

        </View>
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