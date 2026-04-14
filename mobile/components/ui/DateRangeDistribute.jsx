import { useEffect, useState } from 'react';
import { Platform, Modal, View, Text, Pressable, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DateRangeDistribute({ visible, onClose, onDistribute }) {

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // validates: end must be > start. 
  useEffect(() => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      const fixed = new Date(start.getTime() + 1440 * 60000);
      setEndDate(fixed.toISOString());
    }
  }, [startDate, endDate]);

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
                
              {/* Close */}
              <Pressable style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeText}>✕</Text>
              </Pressable>

              {/* Title */}
              <Text style={styles.title}>
                Choose a date range
              </Text>

            <View style={ styles.dateTimeCont }>
              {/* Subtitle */}
              <Text style={styles.subtitle}>
                From:
              </Text>
               {/* Start Date */}
                <DateTimePicker
                value={startDate ? new Date(startDate) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'compact' : 'default'}
                onChange={(e, date) => {
                  if (!date) return;
                  setStartDate(date.toISOString());
                }}
                />
                </View>
              
              {/* Subtitle */}
            <View style={ styles.dateTimeCont }> 
              <Text style={styles.subtitle}>
                To:
              </Text>
                {/* End Date */}
                <DateTimePicker
                value={
                  endDate
                    ? new Date(endDate)
                    : (() => {
                        const d = new Date();
                        d.setDate(d.getDate() + 1);
                        return d;
                      })()
                }
                mode="date"
                display={Platform.OS === 'ios' ? 'compact' : 'default'}
                onChange={(e, date) => {
                  if (!date) return;
                  setEndDate(date.toISOString());
                }}
                />
                </View>
              {/* Buttons */}
              <View style={styles.rowButtons}>
                {/* onDistribute = handleRunAlgorithm */}
                <TouchableOpacity style={styles.halfButton} onPress={() => onDistribute(startDate, endDate)}>
                  <Text style={styles.text}>Distribute</Text>
                </TouchableOpacity>
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
    width: 280,
    backgroundColor: '#0d283d',
    borderRadius: 20,
    padding: 20,
    paddingTop: 30,
    alignItems: 'center',
  },
  dateTimeCont: {
    flexDirection: 'row',
    alignContent: 'center',
    textAlign: 'center',
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
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  rowButtons: {
    marginTop: 10,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
    backgroundColor: '#fff',

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
    color: '#000  ',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
    fontSize: 15,
  },
  subtitle: {
    color: '#c8d7e3',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
},
});