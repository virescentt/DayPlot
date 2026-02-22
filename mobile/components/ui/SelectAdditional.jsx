import { View, Text, StyleSheet, TextInput, Pressable, FlatList, Modal } from 'react-native';
import { pxToPt } from '../../utils/scale';
import font from '../../constants/typography';
import { useContext, useEffect, useState } from 'react';
import { Button } from '@react-navigation/elements';
import { AddNewContext } from '../../context/AddNewContext';
import { useNavigation } from '@react-navigation/native';
import { Alert, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function SelectAdditional({iconFAname = 'bell', myPlaceholder, newTaskProperty, arrayOfValues }) {
  const { common, setCommon, newTask, setNewTask } = useContext(AddNewContext);
  
  const [open, setOpen] = useState(false);
  const [taskPropertyValues, setTaskPropertyValues] = useState(arrayOfValues); 
  const [addModal, setAddModal] = useState(false);
  const [selectedTaskProperty, setSelectedTaskProperty] = useState('New Category');
  
  return (
    <View style={{ width: '50%', alignItems: 'center', flexDirection: 'row', gap: 10 }}>

    <FontAwesome5
        name={iconFAname}
        size={30}
        color="#394c60"
        style={{paddingBottom: 15}}
    />
    <Pressable
        style={styles.input}
        onPress={() => setOpen(true)}
        placeholder={myPlaceholder}
        placeholderTextColor="#394c6080"
    >
        <Text style={[
            styles.categoryName,
            !newTask.newTaskProperty && styles.placeholder
        ]}>
            {newTask.newTaskProperty || myPlaceholder}
        </Text>
        {/* Right inner icon */}
        <FontAwesome5
            name="caret-down"
            size={20}
            color="#394c60"
            style={{ position: 'absolute', right: 10, top: '50%', transform: [{ translateY: -10 }] }}
        />
    </Pressable>
    <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <Pressable onPress={() => setOpen(false)} style={styles.modalBg}>
            <Pressable onPress={(e) => e.stopPropagation()} style={styles.dropdown}>
            
                <FlatList
                    data={taskPropertyValues}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => {
                        const value = item === 'None' ? null : item;

                        return (
                            <Pressable
                            onPress={() => {
                                setNewTask(prev => ({
                                ...prev,
                                newTaskProperty: value,
                                }));
                                setOpen(false);
                            }}
                            >
                            <Text style={styles.item}>{item}</Text>
                            </Pressable>
                        );
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
    fontSize: 10,
  },
  placeholder: {
    color: '#394c6080',
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