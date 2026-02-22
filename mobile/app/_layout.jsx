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
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Animated from 'react-native-reanimated'; 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../context/AuthContext';
import { TasksProvider } from '../context/TasksContext';

export default function RootLayout() {
  console.log("ANIMATED OBJECT: ", Animated);
  const [loaded, error] = useFonts({
    MontserratRegularItalic: Montserrat_400Regular_Italic,
    MontserratRegular: Montserrat_400Regular,
    MontserratMedium: Montserrat_500Medium,
    MontserratBold: Montserrat_700Bold,
    BebasNeueRegular: BebasNeue_400Regular,
  });

  if (!loaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <BottomSheetModalProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <TasksProvider>
            <SafeAreaView style={[{ flex: 1 }, {backgroundColor: '#fff'}]} edges={['top']}>
              <StatusBar style="dark" />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
              </Stack>
            </SafeAreaView>
          </TasksProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </BottomSheetModalProvider>
    </GestureHandlerRootView>

  );
}