import { View, Text, Button } from 'react-native';
import { router } from 'expo-router';

export default function Login() {
  return (
    <View>
      <Text>Логин</Text>

      <Button
        title="Войти"
        onPress={() => router.replace('/home')}
      />

      <Button
        title="Регистрация"
        onPress={() => router.push('/register')}
      />
    </View>
  );
}