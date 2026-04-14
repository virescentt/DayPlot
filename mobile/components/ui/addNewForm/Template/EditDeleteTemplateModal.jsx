import { Modal, View, Text, Pressable, StyleSheet, TouchableWithoutFeedback } from 'react-native';

export default function EditDeleteTemplateModal({ visible, onClose, onThisDay, onFutureDays, header }) {
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
              {/* Cross sign */}
              <Pressable style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeText}>✕</Text>
              </Pressable>

              {/* header */}
              <Text style={styles.title}>{header}</Text>

              {/* Two text zones with a separator */}
              <View style={styles.rowButtons}>
                <Pressable style={styles.halfButton} onPress={onThisDay}>
                  <Text style={styles.text}>This day only</Text>
                </Pressable>
                <View style={styles.divider} />
                <Pressable style={styles.halfButton} onPress={onFutureDays}>
                  <Text style={styles.text}>This and future days</Text>
                </Pressable>
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
    paddingTop: 30, // место для крестика
    alignItems: 'center',
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
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
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
    fontSize: 15,
  },
});