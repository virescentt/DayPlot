import { Modal, View, Text, Pressable, StyleSheet, TouchableWithoutFeedback, TextInput, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useContext, useEffect } from 'react';
import { AddNewContext } from '../../../../context/AddNewContext';
import BackNextComplete from '../BackNextComplete';
import font from '../../../../constants/typography';

export default function AddTemplateEvent({ visible, onClose }) {
    const {template, setTemplate} = useContext(AddNewContext);

    // validates: end must be > start. 
    // Estimated time resets to 15 min.
    useEffect(() => {
        // Go further if there are both start/end datetimes. 
        if (!template.startTime || !template.endTime) return;

        const start = new Date(template.startTime);
        const end = new Date(template.endTime);
        
        if (end <= start) {
            const fixed = new Date(start.getTime() + 15 * 60000);

            setTemplate(prev => ({
                ...prev,
                endTime: fixed.toISOString(),
            }));
        
            return;
        }
        
    }, [
        template.startTime,
        template.endTime,
    ]);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>

              {/* Крестик */}
              <Pressable style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeText}>✕</Text>
              </Pressable>

              {/* Заголовок */}
              <Text style={styles.title}>NEW EVENT</Text>

              {/* Две текстовые зоны с разделителем */}
              <View style={styles.rowButtons}>
                <TextInput
                    style={ styles.input }
                    placeholder="Title"
                    placeholderTextColor={'#c8d7e380'}
                    value={template.label}
                    onChangeText={text => setTemplate(prev => ({...prev, label: text}))}/>
                <TextInput
                    disabled={true}
                    pointerEvents='none'
                    style={[ styles.input, {opacity: 0.5, width: "40%", textAlign: 'center'}]}
                    value={template.dayOfWeek} 
                    />
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {/* Start: Time */}
                    <Text style={ styles.startEndText }>
                        start:
                    </Text>
                    <DateTimePicker
                    value={template.startTime ? new Date(template.startTime) : new Date()}
                    mode="time"
                    is24Hour
                    display={Platform.OS === 'ios' ? 'compact' : 'default'}
                    onChange={(e, time) => {
                        if (!time) return;

                        const updated = new Date(template.startTime);

                        updated.setHours(
                            time.getHours(), 
                            time.getMinutes()
                        );

                        setTemplate(prev => ({ ...prev, startTime: updated.toISOString() }));
                    }}
                    />
                    </View>

                    {/* End: Time */}
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>

                    <Text style={ styles.startEndText }>
                        end:
                    </Text>
                    <DateTimePicker
                        value={template.endTime ? new Date(template.endTime) : new Date()}
                        mode="time"
                        is24Hour
                        display={Platform.OS === 'ios' ? 'compact' : 'default'}
                        onChange={(e, time) => {
                        if (!time) return;

                        const updated = new Date(template.endTime);
                        
                        updated.setHours(
                            time.getHours(), 
                            time.getMinutes()
                        );

                        setTemplate(prev => ({ ...prev, endTime: updated.toISOString() }));
                        }}
                    />
                    </View>
                </View>
                <BackNextComplete iconColor={'#fff'} textColor={'#fff'} textSize={20} iconSize={30} leftBtnText='Cancel' rightBtn='complete'/>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: '#0d283d',
    borderRadius: 20,
    padding: 20,
    paddingTop: 30, // a place for the cross
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeText: {
    color: '#fff',
    fontSize: 18,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  rowButtons: {
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
    gap: 10,
  },
  input: {
    height: 40, 
    borderWidth: 1, 
    borderColor: '#c8d7e3', 
    borderRadius: 10, 
    paddingHorizontal: 10, 
    fontSize: 15,
    color: '#c8d7e3', 
    fontFamily: font.Mregular,
  },
  startEndText: { 
    color: '#3c6674',
    letterSpacing: 1.4,
    textTransform: 'uppercase', 
    fontFamily: font.Mregular, 
    fontSize: 15 
  },
  halfButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  divider: {
    width: 1,
    backgroundColor: '#fff',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
});