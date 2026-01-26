import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_700Bold,
  Montserrat_400Regular_Italic,
} from '@expo-google-fonts/montserrat';
import {
  BebasNeue_400Regular
} from '@expo-google-fonts/bebas-neue';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    MontserratRegularItalic: Montserrat_400Regular_Italic,
    MontserratRegular: Montserrat_400Regular,
    MontserratMedium: Montserrat_500Medium,
    MontserratBold: Montserrat_700Bold,
    BebasNeueRegular: BebasNeue_400Regular,
  });

  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[{ flex: 1 }, {backgroundColor: '#fff'}]} edges={['top']}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}