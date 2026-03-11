import { useState, useRef, useEffect } from "react";
import { 
    View, 
    Text, 
    Pressable, 
    StyleSheet, 
    Animated,
    LayoutAnimation 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import font from "../../../../constants/typography";

export default function TemplateWeekDay() {
    const [expanded, setExpanded] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const animatedHeight = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animatedHeight, {
            toValue: expanded ? contentHeight : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [expanded, contentHeight]);

    return (
        <View style={styles.wrapper}>
            <Pressable style={styles.header} onPress={() => setExpanded(!expanded)}>
                <Text style={styles.title}>My Tasks</Text>
                <Ionicons
                    name={"chevron-forward"}
                    size={20}
                    style={{
                        color: '#ccdbe4',
                        transform: [{ rotate: expanded ? "90deg" : "0deg" }]
                    }}
                />
            </Pressable>

            <Animated.View style={[styles.contentContainer, { height: animatedHeight }]}>
                <View 
                    style={styles.content}
                    onLayout={(event) => {
                        const height = event.nativeEvent.layout.height;
                        setContentHeight(height);
                    }}
                >
                    <Text>• Task 1</Text>
                    <Text>• Task 2</Text>
                    <Pressable style={styles.addButton}>
                        <Text styles={ styles.textAddEvent }>+ add event</Text>
                    </Pressable>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        margin: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        backgroundColor: "#3b6573",
        borderRadius: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: '#c8d7e3',
    },
    contentContainer: {
        overflow: "hidden",
    },
    content: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
        position: "absolute",
        width: "100%",
    },
    addButton: {
        marginTop: 10,
        padding: 8,
        borderWidth: 1,
        borderRadius: 6,
        alignSelf: "flex-start",
    },
    textAddEvent: {
        fontFamily: font.MIregular,
    }
});