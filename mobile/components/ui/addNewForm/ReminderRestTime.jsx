import { View } from "react-native";
import { REMINDER_OFFSET, REST_TIME } from "../../../constants/services";
import SelectAdditional from "../SelectAdditional";

export default function ReminderRestTime() {
    
    return (
      // REMINDER & REST_TIME
      <View style={{ flexDirection: 'row', }}>
        <SelectAdditional myPlaceholder={'Reminder'} newTaskProperty={'reminderOffset'} options={REMINDER_OFFSET}/>
        <SelectAdditional iconFAname='hourglass-start' myPlaceholder={'Rest Time'} newTaskProperty={'restTime'} options={REST_TIME}/>
      </View>

    )
};