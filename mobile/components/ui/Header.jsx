import { View, StyleSheet } from 'react-native'   
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
    backgroundColor: '#fff',
    height: pxToPt(200),
    width: '100%',
    paddingVertical: 6,
    paddingHorizontal: 10,
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
