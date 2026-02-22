import Svg, { Rect, Polygon } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';

export default function TallArrow() {
  return (
    <View style={styles.container}>
      <Svg width="100%" height={60} viewBox="0 0 1000 60">
        {/* Хвост стрелки */}
        <Rect x="0" y="25" width="850" height="10" fill="#0047ab" />

        {/* Кончик стрелки — выше и пропорциональнее */}
        <Polygon points="850,5 1000,30 850,55" fill="#0047ab" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: 60,
    marginVertical: 10,
  },
});