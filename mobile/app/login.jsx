import { View, Text, Pressable, Image, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { router } from 'expo-router';
import font from '../constants/typography.js';
import { pxToPt } from '../utils/scale.js';
import DayPlotTitle from '../components/ui/DayPlotTitle.jsx';


export default function Login() {
  return (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={styles.container}
        >
        <View style={{alignItems: 'center'}}>
          <Image
            source={require('../assets/images/splash-icon.png')}
            style={styles.logo}
            resizeMethod='contain'
          />
          <DayPlotTitle size={pxToPt(114)}/>
        </View>
        
        <View style={styles.form}>
          <TextInput
            style={[styles.input, {marginBottom: pxToPt(50)}]}
            placeholder='EMAIL'
            placeholderTextColor="#fff"
            keyboardType='email-address'
            autoCapitalize='none'
          />
          <TextInput
            style={styles.input}
            placeholderTextColor="#fff"
            placeholder='PASSWORD'
            secureTextEntry
          />
          <Pressable style={styles.forgotButton}>
            <Text style={styles.forgotText}>forgot password?</Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.signInButton]}
            onPress={() => router.replace('/home')}
          >
            <Text style={styles.signInText}>sign in</Text>
          </Pressable>
        </View>

        <Pressable
          style={[styles.button, styles.signUpButton]}
          onPress={() => router.replace('/home')}
        >
          <Text style={styles.signUpText}>sign up</Text>
        </Pressable>
      </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: pxToPt(50)
  },
  logo: {
    width: pxToPt(400),
    height: pxToPt(400),
    marginTop: pxToPt(20),
    marginBottom: pxToPt(30),
  },
  form: {
    width: '80%',
    alignItems: 'center', // центрируем input и forgot password
  },
  input: {
    letterSpacing: pxToPt(1.4),
    width: '100%',
    fontSize: pxToPt(40),
    height: 40,
    borderWidth: 1,
    borderColor: '#1a507a',
    backgroundColor: '#1a507a',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  
  
  button: {
    fontFamily: font.Mregular,
    padding: pxToPt(20),
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInButton: {
    height: 40,
    width: '55%',
    backgroundColor: '#a7bdd2',
    borderColor: '#8aa7bc',
  },
  signUpButton: {
    height: 35,
    width: '35%',
    borderWidth: 3,
    backgroundColor: '#fff',
    borderColor: '#3f6884',
  },
  forgotButton: {
    alignSelf: 'flex-start',
    marginTop: pxToPt(24),
    marginLeft: 10,
    marginBottom: pxToPt(50)
  },


  forgotText: {
    textTransform: 'uppercase',
    letterSpacing: pxToPt(1.4),
    color: '#3f6884',
    fontSize: pxToPt(24),
  },
  signInText: {
    letterSpacing: pxToPt(1.4),
    textTransform: 'uppercase',
    color: '#fff',
    fontSize: pxToPt(40),
  },
  signUpText: {
    textTransform: 'uppercase',
    letterSpacing: pxToPt(1.4),
    color: '#3f6884',
    fontSize: pxToPt(34),
  },

  noAccountText: {
    textTransform: 'uppercase',
    letterSpacing: pxToPt(1.4),
    color: '#',
    fontSize: pxToPt(26),
  },


})
