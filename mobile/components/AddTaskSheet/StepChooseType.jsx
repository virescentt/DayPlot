import { View, Text, StyleSheet, Pressable } from 'react-native';
import font from '../../constants/typography.js';
import { TASK_COLORS, TASK_LABELS } from '../../constants/theme.js';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AddNewContext } from '../../context/AddNewContext.js';

export default function StepChooseType() {
  const { common, setCommon } = useContext(AddNewContext);
   
  return (
    // <Header /> 
    <View style={styles.container}>
      <Text style={ styles.title }>what do you {'\n'} want to add?</Text>
      {['plot_twist', 'plot', 'edit_schedule'].map((type) => (
        <Pressable
          key={type}
          style={[
            styles.typeButton,
            { backgroundColor: TASK_COLORS[TASK_LABELS[type]]?.background || '#888' },
          ]}
          onPress={() => {
            setCommon( (prev) => ({...prev, taskType: type, step: prev.step + 1  }));
          }}
        >
          <Text
            style={[
              styles.typeText,
              { color: TASK_COLORS[TASK_LABELS[type]]?.text || '#fff' },
            ]}
          >
            {type.replace('_', ' ')}
          </Text>
        </Pressable>
      ))}
    </View>
    // <Footer />
  );
 }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a7bdd2',
    alignItems: 'center', 
    justifyContent: 'center'
    
  },
  title: {
    textAlign: 'center',
    color: '#3c6674',
    letterSpacing: 1.4,
    fontFamily: font.Bregular,
    fontSize: 50,
    marginBottom: 20,
  },
  typeButton: {
    width: '80%',
    height: 100,
    borderRadius: 20,
    marginBottom: 10,
    justifyContent: 'center',
  },
  typeText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 25,
    fontFamily: font.Mregular,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  finishButton: {
    marginTop: 20,
  },


})