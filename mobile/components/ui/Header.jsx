import { View, Image, Text, StyleSheet } from 'react-native'   
import font from '../../constants/typography.js';
import { pxToPt } from '../../utils/scale.js';
import DayPlotTitle from './DayPlotTitle.jsx';
import CurrencyBadge from './CurrencyBadge.jsx';

export default function Header() {
    return (
        <View style={styles.container}>
          <DayPlotTitle size={pxToPt(100)} logoStyle={styles.headerLgStyle} containerStyle={styles.headerContStyle} />
          <CurrencyBadge />
        </View>
    );
}


const styles = StyleSheet.create({
  container: {
    height: pxToPt(200),
    width: '100%',
    paddingVertical: 6,
    paddingHorizontal: 10,
    // borderWidth: 1,
    // borderColor: '#1a507a',
  },
  headerContStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLgStyle: {
    width: pxToPt(120),
    height: pxToPt(120),
    marginRight: pxToPt(20),
  },
});
