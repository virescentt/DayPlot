import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import font from '../../constants/typography.js';
import { pxToPt } from '../../utils/scale.js';


export function TaskPoolButton({ count = 3, opened = false }) {
  return (
    <View style={styles.wrapper}>
      <Pressable style={styles.button}>
        {/* стрелка */}
        <Ionicons
          name={opened ? 'chevron-down-outline' : 'chevron-up-outline'}
          size={18}
          color="#3c6674"
        />

        {/* иконка стопки */}
        <View style={{ position: 'relative' }}>
          <Ionicons
            name="layers"
            size={25}
            color="#3c6674"
          />

          {/* бейдж */}
          {/* <View style={styles.badge}> */}
            <Text style={styles.badgeText}>{count}</Text>
          {/* </View> */}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: -12, // 👈 заезжает за экран
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap: 8,

    paddingVertical: 8,
    paddingLeft: 5,
    paddingRight: 26,

    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,

    backgroundColor: 'transparent',
  },

  badge: {
    position: 'absolute',
    top: -6,
    right: -8,

    minWidth: 16,
    height: 16,
    borderRadius: 8,

    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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