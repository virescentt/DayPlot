import { View, StyleSheet } from 'react-native';
import { useContext } from 'react';
import { AddNewContext } from '../../context/AddNewContext.js';
import TitleNCategory from '../ui/addNewForm/TitleNCategory.jsx';
import Priority from '../ui/addNewForm/Priority.jsx';
import Deadline from '../ui/addNewForm/Deadline.jsx';
import BackNextComplete from '../ui/addNewForm/BackNextComplete.jsx';
import Title from '../ui/addNewForm/Title.jsx';
import { TASK_LABELS } from '../../constants/theme.js';
import ScheduleTask from '../ui/addNewForm/ScheduleTask.jsx';
import ReminderRestTime from '../ui/addNewForm/ReminderRestTime.jsx';
import Description from '../ui/addNewForm/Description.jsx';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Header from '../ui/Header.jsx';
import TemplateWeekDay from '../ui/addNewForm/Template/TemplateWeekDay.jsx';
import { WEEKDAYS } from '../../constants/services.js';

export default function StepFormPartOne() {
  const { common } = useContext(AddNewContext);
  const type = TASK_LABELS[common.taskType]
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
      
      {type === 'flexible' && (
        <>
        <Title iconColor='#fff'/>
        <TitleNCategory />
        <Priority />
        <Deadline />
        <BackNextComplete />
        </>
      )}
      {type === 'planned' && (
        <>
        <Title iconColor='#fff' info="Planned events are events that have a strict start and end time. F.ex, a meeting, an appointment, or anything that is unlikely to be rescheduled."/>
        <TitleNCategory />
        <ScheduleTask info="Required. Planned events cannot be collected in the Task Pool."/>
        <ReminderRestTime />
        <Description />
        
        <BackNextComplete rightBtn='complete' />
        </>
      )}
      {type === 'template' && (
        <View style={{flex: 1}}>
          <Title info={'Fill in your typical weekly schedule for each week day. It will be used as a default view for every week.'} iconColor='#fff' textStyle={styles.templateTitle} />

          {Object.entries(WEEKDAYS).map(([key, value]) => {
              console.log("dayKey:", key, "dayLabel:", value)
              return (<TemplateWeekDay key={key} dayKey={key} dayLabel={value} />);
            })}

          <BackNextComplete rightBtn='none'/>
        </View>
        // Template events are events that repeat on specific days of the week, such as school or work.
      )}
      
    </KeyboardAwareScrollView>
    </>
  
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#a7bdd2',
    alignItems: 'center',
    padding: 20,
  },
  templateTitle: {
    fontSize: 30,
    textAlign: 'left',
    alignSelf: 'flex-start',
  }
});