import { View, Text, StyleSheet, TextInput, Pressable, FlatList, Modal } from 'react-native';
import { pxToPt } from '../../utils/scale';
import font from '../../constants/typography';
import { useContext, useEffect, useState } from 'react';
import { Button } from '@react-navigation/elements';
import { AddNewContext } from '../../context/AddNewContext';
import { useNavigation } from '@react-navigation/native';
import { Alert, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function CategorySelect() {
  const { common, setCommon } = useContext(AddNewContext);
  
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]); 
  const navigation = useNavigation();
  const [addModal, setAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState('New Category');

  useEffect(() => {
    setCategories(['None', 'school', 'home', 'hobby', 'personal', 'math']);
  }, []);
  
  return (
    <>
    <Pressable
        style={styles.input}
        onPress={() => setOpen(true)}
        placeholder="Select category"
        placeholderTextColor="#394c6080"
    >
        <Text style={[
            styles.categoryName,
            !common.categoryName && styles.placeholder
        ]}>
            {common.categoryName || 'Select category'}
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
                <Text>Category</Text>
                <FlatList
                    data={categories}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => {
                        const value = item === 'None' ? null : item;

                        return (
                            <Pressable
                            onPress={() => {
                                setCommon(prev => ({
                                ...prev,
                                categoryName: value,
                                }));
                                setOpen(false);
                            }}
                            >
                            <Text style={styles.item}>{item}</Text>
                            </Pressable>
                        );
                    }}
                />
                <View style={{flexDirection: 'row', marginVertical: 15, justifyContent: 'space-between'}}>
                    {/* ADD NEW */}
                    <Pressable
                    onPress={() => {
                        if (Platform.OS === 'ios') {
                        Alert.prompt(
                            'New category',
                            'Enter category name',
                            [
                            { text: 'Cancel', style: 'cancel' },
                            {
                                text: 'Add',
                                onPress: (text) => {
                                if (!text?.trim()) return;

                                const exists = categories.some(
                                    c => c.toLowerCase() === text.toLowerCase()
                                );

                                if (exists) {
                                    Alert.alert(
                                    'Category exists',
                                    'This category already exists.'
                                    );
                                    return;
                                }

                                setCategories(prev => [...prev, text.trim()]);
                                },
                            },
                            ],
                            'plain-text'
                        );
                        }
                    }}
                    >
                    <Text style={styles.add}>+ Add new category</Text>
                    </Pressable>

                    {/* EDIT */}
                    <Pressable
                        style={styles.edit}
                        onPress={() => {
                        setOpen(false);
                        navigation.navigate('CategoriesScreen');
                        }}>
                        <Text style={{fontSize: 20, textDecorationLine: 'underline'}}>Edit</Text>
                    </Pressable>
                </View>

            </Pressable>
        </Pressable>
    </Modal>
    <Modal visible={addModal} transparent>
        <View style={styles.center}>
            {/* <Text>HELLOOOO!!</Text> */}

            <View style={styles.addBox}>
                <Text style={{textAlign: 'center', fontSize: 30, color: '#c8d7e3', fontFamily: font.Bregular}}>Add new category</Text>
                <TextInput
                    style={{height: 40, borderWidth: 1, borderColor: '#c8d7e3', borderRadius: 10, paddingHorizontal: 10, width: '90%', fontSize: 15, color: '#c8d7e3', fontFamily: font.Mregular}}
                    placeholder="Category name"
                    placeholderTextColor={'#c8d7e380'}
                    value={newCategory}
                    onChangeText={setNewCategory}/>

                <Button
                    style={{color: '#000', backgroundColor: '', alignSelf: 'flex-end', fontFamily: font.Bregular}}
                    onPress={() => {
                    setCategories(prev => [...prev, newCategory]);
                    setAddModal(false);
                    }}>Add</Button>
                </View>
        </View>
    </Modal>
    </>
  );
}

const styles = StyleSheet.create({
 input: {
    width: '90%',
    height: 50,
    // borderWidth: 1,
    // borderColor: '#888',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  
  categoryName: {
    color: '#394c60',
    fontFamily: font.Mregular,
    letterSpacing: 1.4,
    fontSize: 20,
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
  
  add: {
    marginTop: 15,
    fontSize: 16,
    color: '#2e7cff',
    fontWeight: '600',
  },
  
  edit: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    marginTop: 1,
  },

  /* ---------- ADD CATEGORY MODAL ---------- */
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  addBox: {
    width: '85%',
    backgroundColor: '#0d283d',
    borderRadius: 16,
    padding: 20,
    gap: 12,
    alignItems: 'center',
  },
});