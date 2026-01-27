import { View, Text, Pressable, Image, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { router } from 'expo-router';
import font from '../../constants/typography.js';
import { isEmailValid } from '../../utils/validation.js';
import { pxToPt } from '../../utils/scale.js';
import DayPlotTitle from '../../components/ui/DayPlotTitle.jsx';
import FormField from '../../components/ui/FormField.jsx';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext.js';
import { registerRequest } from '../../services/auth.js';

export default function Register() {
  const { email, setEmail } = useContext(AuthContext);
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');

  const passwordsMatch = password === repeatPassword;
  const isPasswordValid = password.length >= 6;

  const isFormValid =
    isEmailValid(email) &&
    isPasswordValid;
    

  const handleRegister = async () => {
    if (!passwordsMatch) {
      setError('Passwords do not match.');
      return;
    };

    const result = await registerRequest(email, password);

    if (result.success) {
        setError('');
        router.replace({
          pathname: '/login',
          params: { registered: '1' }
        });
      } else {
        setError(result.message);
      }
  };

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

        <DayPlotTitle size={pxToPt(114)}/>
        
        <View style={styles.form}>
          {error ? <Text style={{ color: 'red', marginVertical: 10, alignSelf: 'flex-start' }}>{error}</Text> : null}
          <TextInput
            style={[styles.input, {marginBottom: pxToPt(50)}]}
            placeholder='Email'
            placeholderTextColor="#ffffff77"
            keyboardType='email-address'
            autoCapitalize='none'
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={[styles.input, {marginBottom: pxToPt(50)}]}
            placeholderTextColor="#ffffff77"
            placeholder='Password'
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={[styles.input, {marginBottom: pxToPt(74)}]}
            placeholderTextColor="#ffffff77"
            placeholder='Repeat Password'
            secureTextEntry
            value={repeatPassword}
            onChangeText={setRepeatPassword}
          />
          <Pressable
            style={[styles.button, styles.signInButton,
               { opacity: isFormValid ? 1 : 0.5 }
            ]}
            onPress={handleRegister}
            disabled={!isFormValid}
          >
            <Text style={[styles.signInText, styles.upperText]}>sign up</Text>
          </Pressable>
        </View>

          <View style={styles.signupBlock}>
            <Text style={styles.AccountText}>
              Already have an account?
            </Text>
          <Pressable
            style={[styles.button, styles.signUpButton, {marginBottom: pxToPt(50)}]}
            onPress={() => router.replace('/login')}
          >
            <Text style={[styles.signUpText, styles.upperText]}>sign in</Text>
          </Pressable>
        </View>
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
    color: 'white'
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
    borderWidth: 3,
    backgroundColor: '#fff',
    borderColor: '#3f6884',
  },
  signUpButton: {
    height: 35,
    width: '35%',
    backgroundColor: '#a7bdd2',
    borderColor: '#8aa7bc',
    
  },
  forgotButton: {
    alignSelf: 'flex-start',
    marginTop: pxToPt(24),
    marginLeft: 10,
    marginBottom: pxToPt(50)
  },

  upperText: {
    textTransform: 'uppercase',
    letterSpacing: pxToPt(1.4),
  },
  forgotText: {
    color: '#3f6884',
    fontSize: pxToPt(30),
  },
  signInText: {
    color: '#3f6884',
    fontSize: pxToPt(40),
  },

  signupBlock: {
    width: '100%',
    alignItems: 'center',

    marginTop: pxToPt(20),
  },
  signUpText: {
    color: '#fff',
    fontSize: pxToPt(34),
  },

  AccountText: {
    marginBottom: pxToPt(12),
    letterSpacing: pxToPt(1.4),
    color: '#3f6884',
    fontSize: pxToPt(26),
  },


})
