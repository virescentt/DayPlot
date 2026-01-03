import { View, Image, Text, StyleSheet } from 'react-native'   
import font from '../../constants/typography.js';
import { pxToPt } from '../../utils/scale.js';

export default function DayPlotTitle( { size = 26, containerStyle, logoStyle } ) {
    return (
        <View style={[styles.logoText, {alignItems: 'center'}, containerStyle]}>
          <Image
            source={require('../../assets/images/splash-icon.png')}
            style={[styles.logo, styles.logoStyle]}
            resizeMethod='contain'
          />
          <Text style={[styles.fp, { fontSize: size }]}>DAY
              <Text style={[styles.sp, { fontSize: size }]}>PLOT</Text>
          </Text>
        </View>
    );
}


const styles = StyleSheet.create({
  fp: {
    fontFamily: font.Bregular,
    color: '#8aa7bcb3',
  },
  sp: {
    fontFamily: font.Bregular,
    color: '#0d283db3',
  },
  logo: {
      width: pxToPt(400),
      height: pxToPt(400),
      marginTop: pxToPt(20),
      marginBottom: pxToPt(30),
    },
  
});
