import { View, Text, StyleSheet } from 'react-native';
import font from '../../constants/typography';
import { pxToPt } from '../../utils/scale';



export default function Task() {
    const fontS = pxToPt(41);
    const labelHeight = fontS * 1.2;
    const checkh = 3 + labelHeight + 5

    return (
        <>
        
        </>
    );
}

const styles = StyleSheet.create({
    label: {
        marginBottom: 5, 
        textAlign: 'center', 
        textTransform: 'uppercase', 
        fontFamily: font.Mregular, 
        color: '#394c60',
    }
})