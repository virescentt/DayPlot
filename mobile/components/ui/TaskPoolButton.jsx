import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import font from '../../constants/typography.js';
import { pxToPt } from '../../utils/scale.js';


export function TaskPoolButton({ count = 3, opened = false, iconsColor = '#3c6674', numberColor = '#394c60' }) {

  return (
    <>
      <View style={styles.wholeIcon}>
        <Ionicons
          name={opened ? 'chevron-down-outline' : 'chevron-up-outline'}
          size={18}
          color={iconsColor}
        />

        <View style={{ position: 'relative' }}>
          <Ionicons
            name="layers"
            size={25}
            color={iconsColor}
          />

          <Text style={[styles.badgeText, {color: numberColor }]}>{count}</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wholeIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap: 8,
  },

  badgeText: {
    position: 'absolute',
    right: -6,
    fontFamily: font.Bregular,
    fontSize: pxToPt(50),


    color: '#394c60',
    fontWeight: '600',
  },
});