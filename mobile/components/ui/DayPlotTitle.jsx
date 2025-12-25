import { Text, StyleSheet } from 'react-native'   
import font from '../../constants/typography';

export default function DayPlotTitle( { size = 26} ) {
    return (
        <Text style={[styles.fp, { fontSize: size }]}>DAY
            <Text style={[styles.sp, { fontSize: size }]}>PLOT</Text>
        </Text>
    );
}


const styles = StyleSheet.create({
  fp: {
    fontFamily: font.Bregular,
    color: '#8aa7bc',
  },
  sp: {
    fontFamily: font.Bregular,
    color: '#0d283d',
  },
});
