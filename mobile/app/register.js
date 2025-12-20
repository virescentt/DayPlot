import { View, Text, Button } from 'react-native';
import { router } from 'expo-router';

export default function Register() {
  return (
    <View>
      <Text>Регистрация</Text>

      <Button
        title="Назад к логину"
        onPress={() => router.back()}
      />
    </View>
  );
}