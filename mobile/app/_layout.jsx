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


export default function Layout() {
  const [loaded, error] = useFonts({
    MontserratRegularItalic: Montserrat_400Regular_Italic,
    MontserratRegular: Montserrat_400Regular,
    MontserratMedium: Montserrat_500Medium,
    MontserratBold: Montserrat_700Bold,
    BebasNeueRegular: BebasNeue_400Regular,
  });

  if (!loaded && !error) return null;
  return <Stack screenOptions={{ headerShown: false }} />;
}