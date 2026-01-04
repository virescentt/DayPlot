import { View, Image, Text, StyleSheet } from 'react-native';
import { pxToPt } from '../../utils/scale';
import font from '../../constants/typography';

export default function CurrencyBadge() {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>456</Text>
      <Image
        source={require('../../assets/images/currency.png')}
        style={styles.icon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: pxToPt(50),
    right: pxToPt(-100), // уезжает за экран
    height: pxToPt(90),
    width: pxToPt(350),
    backgroundColor: '#c8d7e3',
    borderRadius: pxToPt(40),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: pxToPt(120),
  },
  icon: {
    width: pxToPt(40),
    height: pxToPt(40),
    marginRight: pxToPt(12),
  },
  text: {
    color: '#0d283d',
    fontSize: pxToPt(40),
    fontFamily: 'YourFont-Bold',
    fontFamily: font.Mbold,
    marginRight: pxToPt(7),
    letterSpacing: pxToPt(1.4)
  },
});