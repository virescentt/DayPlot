import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{
        headerShown: false,
        title: 'Profile'
        }} />
      <Stack.Screen name="language" options={{ title: 'Language' }} />
      <Stack.Screen name="privacy" options={{ title: 'Privacy & Safety' }} />
      <Stack.Screen name="faq" options={{ title: 'FAQ' }} />
      <Stack.Screen name="legal" options={{ title: 'Legal & Policies' }} />
      <Stack.Screen name="time" options={{ title: 'Time Limits' }} />
      <Stack.Screen name="report" options={{ title: 'Report a Problem' }} />
    </Stack>
  );
}