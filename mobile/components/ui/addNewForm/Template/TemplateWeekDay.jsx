import { useState, useRef, useEffect, useContext } from "react";
import { 
    View, 
    Text, 
    Pressable, 
    StyleSheet, 
    Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import font from "../../../../constants/typography";
import { TasksContext } from "../../../../context/TasksContext";
import TaskCard from "../../TaskCard";
import AddTemplateEvent from "./AddTemplateEvent";
import { AddNewContext } from "../../../../context/AddNewContext";

export default function TemplateWeekDay({ dayKey, dayLabel }) {
    const { tasks } = useContext(TasksContext);
    const { setTemplate } = useContext(AddNewContext);
    const [expanded, setExpanded] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const animatedHeight = useRef(new Animated.Value(0)).current;
    const [modalVisible, setModalVisible] = useState(false);

    const openEditModal = () => setModalVisible(true);
    const closeEditModal = () => setModalVisible(false);


    const templateEvents = 
        tasks.filter(t => (t.type === 'template' && t.dayOfWeek?.toUpperCase() === dayKey))

    useEffect(() => {
        Animated.timing(animatedHeight, {
            toValue: expanded ? contentHeight : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [expanded, contentHeight]);

    return (
        <>
        <View style={[
            styles.wrapper,
            {opacity: templateEvents.length === 0 ? 0.5 : 1}
            ]}>
            <Pressable style={styles.header} onPress={() => setExpanded(!expanded)}>
                <Text style={styles.title}>{dayLabel}{"  "}
                    <Text style={{ color: '#c8d7e380' }}>{templateEvents.length}</Text>
                </Text>
                <Ionicons
                    name={"chevron-forward"}
                    size={25}
                    style={{
                        color: templateEvents.length === 0 ? '#ffffff' : '#ccdbe4',
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
                    {templateEvents.length === 0
                    ? <Text>There is no events yet :(</Text> 
                    :    templateEvents.map(task => (
                        <TaskCard modeOverride="day" key={`${task.type}-${task.id}`} task={task} />
                        ))}
                    <Pressable 
                    style={styles.addButton}
                    onPress={() => {
                        setTemplate(prev => ({ ...prev, dayOfWeek: dayKey }))
                        openEditModal();
                    }}
                    >
                        <Text styles={ styles.textAddEvent }>+ add event</Text>
                    </Pressable>
                </View>
            </Animated.View>
        </View>
        
        <AddTemplateEvent
            visible={modalVisible}
            onClose={closeEditModal}
        />
        </>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        margin: 5,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#3b6573",
        borderRadius: 8,
    },
    title: {
        fontSize: 20,
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