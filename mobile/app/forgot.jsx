import { View, Text, Pressable, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { router } from 'expo-router';
import font from '../constants/typography.js';
import { pxToPt } from '../utils/scale.js';
import DayPlotTitle from '../components/ui/DayPlotTitle.jsx';


export default function Forgot() {
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
        <View style={styles.container}>
       
          <DayPlotTitle size={pxToPt(114)}/>
        
          <View style={[styles.form, {marginBottom: pxToPt(200)}]}>
            <Text style={[styles.title, styles.upperText]}>
              Reset Password
            </Text>
            <Text style={[styles.description]}>
              Enter your email address linked to your account, and we will send you a password reset code.
            </Text>
              <TextInput
                style={[styles.input, {marginBottom: pxToPt(20)}]}
                placeholder='Email'
                placeholderTextColor="#fff"
                keyboardType='email-address'
                autoCapitalize='none'
              />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.inputCode]}
                placeholder='Code'
                placeholderTextColor="#fff"
                keyboardType='numeric'
              />
              
              {/* CHECK IF THE EMAIL IN THE DB */}
              <Pressable
                style={[styles.button, styles.signInButton]}
                onPress={() => router.replace('/login')}
              >
                <Text style={[styles.signInText, styles.upperText]}>Send Code</Text>
              </Pressable>
            </View>
          </View>


          <Pressable
            onPress={() => router.back('/login')}      
          >
            <Text style={styles.AccountText}>
              ← Back to <Text style={styles.loginText}>Login</Text>
            </Text>
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
  inputCode: {
    width: '45%',
    display: "inline",
    borderColor: '#1a507a80',
    backgroundColor: '#1a507a80',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  button: {
    fontFamily: font.Mregular,
    padding: pxToPt(20),
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: pxToPt(50),
    color: '#1a507a',
    marginBottom: pxToPt(40),
    fontFamily: font.Mregular
  },
  description: {
    textAlign: 'center',
    fontSize: pxToPt(27),
    color: '#93a4b7',
    marginBottom: pxToPt(40),
    fontFamily: font.Mregular
  },
  loginText: {
    fontFamily: font.Mbold
  },
  signInButton: {
    display: "inline",
    height: 40,
    width: '45%',
    borderWidth: 3,
    backgroundColor: '#fff',
    borderColor: '#3f6884',
  },
  upperText: {
    textTransform: 'uppercase',
    letterSpacing: pxToPt(1.4),
  },
  
  signInText: {
    color: '#3f6884',
    fontSize: pxToPt(30),
  },

  AccountText: {
    marginBottom: pxToPt(12),
    letterSpacing: pxToPt(1.4),
    color: '#3f6884',
    fontSize: pxToPt(26),
    textDecorationLine: 'underline' 
  },


})
