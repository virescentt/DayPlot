import { Tabs } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { TasksProvider } from '../../context/TasksContext';

export default function TabsLayout() {
  return (
    <TasksProvider>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
            title: 'Home',
          }}
        />

        <Tabs.Screen
          name="add"
          options={{
            tabBarIcon: ({ size, color }) => (
              <Feather name="plus" size={size + 6} color={color} />
            ),
            title: 'Add Plot',
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-circle" size={size} color={color} />
            ),
            title: 'Profile',
          }}
        />
      </Tabs>
    </TasksProvider>

  );
}
