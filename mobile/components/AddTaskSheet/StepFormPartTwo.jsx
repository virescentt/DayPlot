import { StyleSheet } from 'react-native';
import { useContext } from 'react';
import { AddNewContext } from '../../context/AddNewContext.js';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import BackNextComplete from '../ui/addNewForm/BackNextComplete.jsx';
import ReminderRestTime from '../ui/addNewForm/ReminderRestTime.jsx';
import ScheduleTask from '../ui/addNewForm/ScheduleTask.jsx';
import EstimatedTime from '../ui/addNewForm/EstimatedTime.jsx';
import Description from '../ui/addNewForm/Description.jsx';
import Title from '../ui/addNewForm/Title.jsx';
import Header from '../ui/Header.jsx';

export default function StepFormPartTwo() {

  return (
    <>
    <Header /> 
    
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: '#a7bdd2' }}
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={20}
      keyboardShouldPersistTaps="handled"
    >
      <Title iconColor='#fff'/>
      
      <ScheduleTask />

      <ReminderRestTime />

      <EstimatedTime />
      
      <Description />

      <BackNextComplete rightBtn='complete' />

    </KeyboardAwareScrollView>
    </>
  );
}

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1, 
    backgroundColor: '#a7bdd2',
    alignItems: 'center',
    padding: 20,
  },
});



