import { View, Text, StyleSheet, Pressable, FlatList, Modal } from 'react-native';
import font from '../../constants/typography';
import { useContext, useState } from 'react';
import { AddNewContext } from '../../context/AddNewContext';
import { FontAwesome5 } from '@expo/vector-icons';


export default function SelectAdditional({
  iconFAname = 'bell',
  myPlaceholder,
  newTaskProperty,
  options = [], // { label, value }
  value = null,
  readonly = false,
}) {
  const { newTask, setNewTask } = useContext(AddNewContext);
  const [open, setOpen] = useState(false);

  const selectedOption = options.find(opt => 
    opt.value === (value !== null && value !== undefined ? value : newTask[newTaskProperty])
  );

  const displayText = newTask[newTaskProperty] == null // null || undefined
  ? myPlaceholder
  : selectedOption?.label ?? myPlaceholder;

  return (
    <View style={{ width: '50%', alignItems: 'center', flexDirection: 'row', gap: 10 }}>
      <FontAwesome5 name={iconFAname} size={30} color="#e1eaf3" style={{paddingBottom: 15}} />
      <Pressable disabled={readonly} style={[styles.input, {opacity: readonly ? 0.5 : 1}]} onPress={() => !readonly && setOpen(true)}>
        <Text style={[ styles.categoryName, !newTask[newTaskProperty] && styles.placeholder ]}>
          {displayText}
        </Text>
        <FontAwesome5 name="caret-down" size={20} color="#2a5b85" style={{ position: 'absolute', right: 10, top: '50%', display: readonly && 'none', transform: [{ translateY: -10 }] }} />
      </Pressable>

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <Pressable onPress={() => setOpen(false)} style={styles.modalBg}>
          <Pressable onPress={(e) => e.stopPropagation()} style={styles.dropdown}>
            <Text>{myPlaceholder}</Text>
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
                
                return (
                <Pressable onPress={() => {
                  setNewTask(prev => ({ ...prev, [newTaskProperty]: item.value }));
                  setOpen(false);
                }}>
                  <Text style={styles.item}>{item.label}</Text>
                </Pressable>
                )
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
 input: {
    width: 120,
    height: 40,
    // borderWidth: 1,
    // borderColor: '#888',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  
  categoryName: {
    color: '#3d6984',
    fontFamily: font.Mregular,
    letterSpacing: 1.4,
    fontSize: 13,
  },
  placeholder: {
    color: '#3d6984',
  },
  /* ---------- MAIN MODAL ---------- */

  modalBg: {
    flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  
  dropdown: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '50%',
  },
  
  item: {
    fontSize: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});