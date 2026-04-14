import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import font from "../../constants/typography";
import { Button } from "@react-navigation/elements";
import { TaskPoolButton } from "./TaskPoolButton";
import InfoLabel from "./InfoLabel";
import TaskCard from "./TaskCard";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { SelectedTaskContext } from "../../context/SelectedTaskContext";
import { TasksContext } from "../../context/TasksContext";
import { autoDistribute } from "../../algorithm/autoDistributeAlgorithm";
import RestTimeModal from "./RestTimeModal";
import DateRangeDistribute from "./DateRangeDistribute";

export default function TaskPoolBottomSheet() {
  const { poolBottomSheetVisible, setPoolBottomSheetVisible, handleAutoDistribute, handleSkipRest, handleGenerateRest, handleRunAlgorithm, showRestModal, showDateModal, setShowRestModal, setShowDateModal} = useContext(SelectedTaskContext)
  const { poolTasks } = useContext(TasksContext)

  if (poolTasks.length === 0) return;

  const onClose = () => setPoolBottomSheetVisible(false)
  
  return (
    <Modal
      isVisible={poolBottomSheetVisible}
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
            {/* Title */}
            <InfoLabel info={"Tasks without scheduled time will be displayed here in task pool."} iconColor={'#fff'} textStyle={styles.taskTitle} label={"TASK POOL"} />
            <TouchableOpacity onPress={onClose} style={ styles.wrapper }>
              <TaskPoolButton numberColor="#a7bdd2" iconsColor="#a7bdd2" count={poolTasks.length} opened={true} />
            </TouchableOpacity>
        </View>

        {/* TASK CONTENT */}
        <ScrollView  
            contentContainerStyle={{ gap: 5 }}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
            style={{marginBottom: 20}}
        >
            {poolTasks.map(task => (
              <TaskCard key={`${task.type}-${task.id}`} task={task} modeOverride={'day'}/>
            ))}
        </ScrollView>

        {/* BUTTONS */}
        <View style={ styles.buttons }>
            {/* UNDO BUTTON */}
            <View style={{ backgroundColor: '#c8d7e3', paddingVertical: 10, paddingHorizontal: 10, borderRadius: "50%"}}>
                <Octicons
                    name="undo"
                    size={30}
                    color="#000"
                    onPress={() => 0}
                />
            </View>
            {/* DISTRIBUTE BUTTON */}
            <TouchableOpacity
            style={{ paddingVertical: 20, justifyContent: 'center', backgroundColor: '#c8d7e3', paddingHorizontal: 20, borderRadius: 20 }} onPress={handleAutoDistribute}>
                <Text style={styles.btnText}>auto distribute</Text>
            </TouchableOpacity>
        </View>

      </View>
      <RestTimeModal
        visible={showRestModal}
        onClose={() => setShowRestModal(false)}
        onGenerate={handleGenerateRest}
        onSkip={handleSkipRest}
      />

      <DateRangeDistribute
        visible={showDateModal}
        onClose={() => setShowDateModal(false)}
        onDistribute={handleRunAlgorithm}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  container: {
    backgroundColor: "#3d6984",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
    paddingBottom: 30
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
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
  },
  taskTitle: {
    fontSize: 30,
    fontFamily: font.Mregular,
    color: '#fff',
    textTransform: 'uppercase',
  },
  wrapper: {
    position: 'absolute',
    right: -12, // goes beyond the screen
    paddingVertical: 8,
    paddingLeft: 5,
    paddingRight: 26,
  },
  buttons: {
    flexDirection: 'row',
    gap: 30,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  btnText: {
    color: '#394c60', 
    fontFamily: font.Mbold,

    fontSize: 20, 
    textTransform: 'uppercase'
  },
});