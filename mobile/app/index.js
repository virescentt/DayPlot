import { Redirect } from 'expo-router';

export default function Index() {
  const isLoggedIn = false; // потом будет реальная проверка

  return isLoggedIn
    ? <Redirect href="/home" />
    : <Redirect href="/login" />;
}