import { View, Text, StyleSheet, Pressable } from 'react-native';
import { pxToPt } from '../../utils/scale.js';
import { router } from 'expo-router';
import font from '../../constants/typography.js';
import Header from '../../components/ui/Header.jsx';
import Footer from '../../components/ui/Footer.jsx';
import { Ionicons } from '@expo/vector-icons';
import { TASK_COLORS, TASK_LABELS } from '../../constants/theme.js';
import BottomSheet, { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import StepChooseType from '../../components/AddTaskSheet/StepChooseType.jsx';
import { AddNewContext } from '../../context/AddNewContext.js';
import StepFormPartOne from '../../components/AddTaskSheet/StepFormPartOne.jsx';
import StepFormPartTwo from '../../components/AddTaskSheet/StepFormPartTwo.jsx';


export default function Add() {
  const { common, setCommon, flexible, setFlexible } = useContext(AddNewContext);

  const renderStepContent = () => {
    if (common.step === 1) {
      // Step 1: choose a task type
      return <StepChooseType  />;
    } else if (common.step === 2) {
      // Этап 2: choose a category
      return <StepFormPartOne />
    } else if (common.step === 3) {
      // Этап 3: настройки + кнопка завершить
      return <StepFormPartTwo />
      return (
        <>
          <Text style={styles.title}>Final settings</Text>
          <Text style={{ color: '#3c6674', marginBottom: 20 }}>
            Task: {taskType}, Category: {category}
          </Text>

          <Pressable
            style={styles.finishButton}
            onPress={() => {
              console.log('Task created:', { taskType, category });
              setStep(1);
              setTaskType(null);
              setCategory(null);
            }}
          >
            <Ionicons name="checkmark-circle" size={60} color="green" />
          </Pressable>
        </>
      );
    }
  };



  return renderStepContent();

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a7bdd2',
    alignItems: 'center', 
    justifyContent: 'center'
    
  },
  title: {
    textAlign: 'center',
    color: '#3c6674',
    letterSpacing: 1.4,
    fontFamily: font.Bregular,
    fontSize: 50,
    marginBottom: 20,
  },
  typeButton: {
    width: '80%',
    height: 100,
    borderRadius: 20,
    marginBottom: 10,
    justifyContent: 'center',
  },
  typeText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 25,
    fontFamily: font.Mregular,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  finishButton: {
    marginTop: 20,
  },


})
