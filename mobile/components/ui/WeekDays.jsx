import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import font from '../../constants/typography';
import { pxToPt } from '../../utils/scale';



export default function WeekDays() {
    const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const onSelectDay = (day) => {
        console.log(day);
    };
    const fontS = pxToPt(41);
    const labelHeight = fontS * 1.2;
    const checkh = 3 + labelHeight + 5 + 4
    return (
        <FlatList
        data={DAYS}
        horizontal
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={ styles.flatList }
            renderItem={({ item }) => (
            <Pressable onPress={() => onSelectDay(item)}>
            <View style={styles.day}>
                <Text style={[styles.label, {fontSize: fontS}]}>{item}</Text>

                <View style={[styles.tasksContainer, {fontSize: fontS }]}>
                    {/* <Text>лейбл = {labelHeight}
                            {'\n'}
                            всего (паддинг 3 над лейблом + лейбл + марджин под лейблом 5, + 4 паддинг вниз внутри таск конта) = {checkh}
                    </Text> */}
                {/* tasks */}
                </View>
            </View>
            </Pressable>
        )}
        />
    );
}


const styles = StyleSheet.create({
    flatList: {
        flexDirection: 'row', 
        paddingHorizontal: 12,
        gap: 10
    },
    day: {
        flex: 1, 
        
        width: 120, 
        paddingTop: 3,
        gap: 5,
    },
    label: {
        marginBottom: 5, 
        textAlign: 'center', 
        textTransform: 'uppercase', 
        fontFamily: font.Mregular, 
        color: '#394c60',
    },
    tasksContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#3c6674',
        borderRadius: 10,
        paddingTop: 4,
    }
})