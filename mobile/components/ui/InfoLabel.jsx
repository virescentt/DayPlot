import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { useContext, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import font from '../../constants/typography';
import { AddNewContext } from '../../context/AddNewContext';
import { TASK_LABELS } from '../../constants/theme';

export default function InfoLabel({
  label,
  info,
  textStyle,
  infoTitle = '',
  iconColor
}) {
  const { common } = useContext(AddNewContext);
  const [visible, setVisible] = useState(false);

  return (
    <>
      {/* LABEL + ICON */}
      <View style={[styles.row, {width: TASK_LABELS[common.taskType] === 'template' && '100%'}]}>
        <Text style={[styles.label, textStyle]}>
          {label}
        </Text>

        <Pressable onPress={() => setVisible(true)}>
          <MaterialIcons
            name="help-outline"
            size={20}
            color={iconColor}
          />
        </Pressable>
      </View>

      {/* MODAL */}
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modal}>
            {infoTitle && (
            <Text style={styles.infoTitle}>{infoTitle}</Text>
            )}
            <Text style={styles.infoText}>{info}</Text>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },

  label: {
    fontFamily: font.Bregular,
    fontSize: 40,
    color: '#3c6674',
    textTransform: 'uppercase',
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },

  infoText: {
    fontFamily: font.Mregular,
    fontSize: 16,
    color: '#394c60',
  },
  infoTitle: {
    marginBottom: 10,
    fontSize: 20,
    fontFamily: font.Bregular,
  }
});