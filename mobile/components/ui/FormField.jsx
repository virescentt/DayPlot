import { View, Text, TextInput, StyleSheet } from "react-native"
import { pxToPt } from '../../utils/scale.js';

export default function FormField({ label, required, myStyle, ...props }) {
  return (
    <View style={{ width: '100%' }}>
      <TextInput style={[styles.input, myStyle]} {...props} />
    </View>
  );
}


const styles = StyleSheet.create({
    input: {
        letterSpacing: pxToPt(1.4),
        width: '100%',
        fontSize: pxToPt(40),
        height: 40,
        borderWidth: 1,
        borderColor: '#1a507a',
        backgroundColor: '#1a507a',
        borderRadius: 8,
        paddingHorizontal: 12,
    },

})