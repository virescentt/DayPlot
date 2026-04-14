import React, { useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import font from "../../constants/typography";
import { formatTaskDateToInfo, formatTaskTimeRange } from "../../services/tasks";
import SelectAdditional from "./SelectAdditional";
import { REMINDER_OFFSET, REST_TIME } from "../../constants/services";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { SelectedTaskContext } from "../../context/SelectedTaskContext";
import { Button } from "@react-navigation/elements";
import { TasksContext } from "../../context/TasksContext";

export default function TaskBottomSheet({
  task,
  onEdit,
}) {
  const { ToggleDoneBottomSheet, bottomSheetVisible, setBottomSheetVisible, onDeleteTask, closeTaskSheet } = useContext(SelectedTaskContext)
  
  // const onClose = () => closeTaskSheet()
  const onClose = () => closeTaskSheet()
  if (!task || task.type === 'template') return null;
  console.log("START!!!! : ", task.start)
  console.log("END!!!! : ", task.end)
  console.log("ПРОВЕРОЧКА??? ", bottomSheetVisible, task?.id)
  return (
    <Modal
      isVisible={bottomSheetVisible}
      onSwipeComplete={onClose}
      onBackdropPress={onClose}
      customSwipeArea={30}
      swipeDirection="down"
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={300}
      style={[styles.modal]}
      propagateSwipe={true}
    >
      <View style={styles.container}>
        {/* Handle */}
        <View style={styles.handle} />
        
        {/* task HEADER */}
        <View style={styles.headerRow}>
            {/* Back Arrow */}
            <TouchableOpacity 
                style={styles.backBtn} 
                onPress={() => onClose()}
            >
                <Ionicons name="arrow-back" size={30} color="#3f6884" />
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.taskTitle}>task details</Text>
            <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
                <Text style={styles.btnText}>Edit</Text>
            </TouchableOpacity>
        </View>

        {/* TASK CONTENT */}
        <ScrollView  
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
        >
            <Text style={styles.title}>{task.title}</Text>
            
            {/* start/end DateTime */}
            {task.start && task.end
            ?    (<>
                <Text style={styles.dateTime}>
                    {formatTaskDateToInfo(task.start)}{","}
                </Text>

                <Text style={styles.dateTime}>
                    {formatTaskTimeRange(task.start, task.end)}
                </Text></>)
            : (<Text style={styles.dateTime}>Estimated time: {task.estimatedTime / 60}{" hr"}</Text>)
            }
            <View style={{ flexDirection: 'row', marginVertical: 15 }}>
                <SelectAdditional
                    myPlaceholder="Reminder"
                    newTaskProperty="reminderOffset"
                    options={REMINDER_OFFSET}
                    value={task.reminderOffset} 
                    readonly={true} 
                />
                <SelectAdditional
                    iconFAname='hourglass-start' 
                    myPlaceholder={'Rest Time'} 
                    newTaskProperty={'restTime'} 
                    options={REST_TIME}
                    value={task.restTime}
                    readonly={true}
                />
            </View>
           
            {/* Description */}
            <Text style={styles.description}>{task.description ? task.description : "No description"}</Text>
            
            {/* Type */}
            <Text style={ styles.title3 }>Type:{" "}
                <Text style={[styles.title3, {color: '#0d283d'} ]}>{task.type}</Text>
            </Text>

            {/* Category */}
            <Text style={ styles.title3 }>Category:{" "}
                <Text style={[styles.title3, {color: '#0d283d'} ]}>{task.category ? task.category : " - "}</Text>
            </Text>

            {/* Priority & Deadline */}
            {task.type === "flexible" && (
                <>
                <Text style={ styles.title3 }>Priority:{" "} 
                    <Text style={[styles.title3, {color: '#0d283d'} ]}>{task.priority}</Text>
                </Text>

                <Text style={styles.title3}>
                    Deadline:{" "}
                    <Text style={[styles.title3, {color: '#0d283d'}]}>
                        {task.deadline 
                        ? new Date(task.deadline).toLocaleString("en-US", { 
                            month: "long", 
                            day: "numeric", 
                            hour: "2-digit", 
                            minute: "2-digit",
                            hour12: false 
                            }) 
                        : "-"}
                    </Text>
                    </Text>
                </>
            )}

            {/* Status */}
            <View style={styles.row}>
                <Text style={styles.status}>
                    Status:{" "}
                </Text>
                <Text style={[styles.status, task.is_done ? styles.done : styles.notDone]}>
                    {task.is_done ? "Done" : "Not done"}
                </Text>
                <TouchableOpacity
                    style={styles.doneCheckbox}
                    onPress={() => ToggleDoneBottomSheet(task.id, task.type)}
                >
                    <Ionicons
                    name={task.is_done ? 'checkbox' : 'square-outline'}
                    size={24}
                    color={task.is_done ? 'green' : 'red'}
                    />
                </TouchableOpacity>
            
            </View>

            {/* DELETE BUTTON */}
            <View style={{ marginTop: 30 }}>
              <Button title="Delete" onPress={() => onDeleteTask(task.id, task.type)} color="#ff0000"><Text style={{color: 'white', fontFamily: font.Mregular, fontSize: 18}}>Delete</Text></Button>
            </View>

        </ScrollView>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  container: {
    backgroundColor: "#a7bdd2",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    alignSelf: "center",
    borderRadius: 3,
    marginBottom: 10,
  },
  headerRow: {
    position: 'relative',
    // flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 5,
    zIndex: 1,
  },
  taskTitle: {
    fontSize: 30,
    fontFamily: font.Mregular,
    color: '#3f6884',
    textTransform: 'capitalize',
  },
  title: {
    fontSize: 35,
    marginBottom: 10,
    fontFamily: font.Mbold,
    color: '#0d283d',
  },
  title3: {
    textAlign: 'left',
    color: '#3c6674',
    letterSpacing: 1.4,
    fontFamily: font.Mregular,
    fontSize: 20,
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  dateTime: {
    color: '#0d283d',
    fontFamily: font.Mregular,
    fontSize: 15,
  },
  description: {
    fontSize: 20,
    marginBottom: 20,
    color: '#0d283d',
    fontFamily: font.Mbold,
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 15,
  },
  status: {
    fontSize: 20,
    color: '#0d283d',
    fontFamily: font.Mbold,
  },
  done: {
    color: "green",
  },
  notDone: {
    color: "red",
  },
  doneCheckbox: {
    marginLeft: 10,
  },
  editBtn: {
    position: 'absolute',
    right: 0, // справа
  },
  btnText: {
    color: '#3f6884',
    fontFamily: font.Mregular,
    textDecorationLine: 'underline',
    fontSize: 25,
    },
});