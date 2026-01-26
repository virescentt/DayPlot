import { Pressable, View, StyleSheet, Text } from "react-native"
import font from "../../constants/typography";
import { pxToPt } from "../../utils/scale";
import Arrow from './Arrow.jsx';

export default function DateBadge({ mode }) {
    return (
    <>
    {/* Date Badge */}
    <View style={ styles.container }>

        {/* <Ionicons name="arrow-back-outline" size={12} color="#3c6674"/> */}
        <Arrow ength={20} thickness={2} direction="left" />
        <Text style={ styles.dateText }>
        28 dec — 4 jun {"\t"}
        <Text style={ styles.currentText }>current</Text>
        </Text>
        <Arrow length={20} thickness={2} direction="right" />
    </View>
    </>
)}

const styles = StyleSheet.create({
    container: {
        width: '100%', 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginVertical: 10
    },
    currentText: {
        textDecorationLine: 'underline',
        color: '#e1eaf3',
        paddingLeft: 8, 
    },
    dateText: {
        letterSpacing: 1.4,
        fontFamily: font.Bregular,
        textTransform: 'uppercase',
        fontSize: pxToPt(50),
        color: '#3c6674',
        marginLeft: 10,
        marginRight: 10,
    },
}) 