import { Tabs } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { TasksContext } from '../../context/TasksContext';
import { useContext } from 'react';
import { AddNewProvider } from '../../context/AddNewContext';
import { TimeLimitsProvider } from '../../context/TimeLimitsContext';
import { SelectedTaskProvider } from '../../context/SelectedTaskContext';


export default function TabsLayout() {
  const { setMode, setSelectedDay } = useContext(TasksContext);
 
  return (
    <TimeLimitsProvider>
      <AddNewProvider>
        <SelectedTaskProvider>
          <Tabs screenOptions={{
              headerShown: false, // 👈 THIS REMOVES THE HEADER IN ALL TABS
            }}>
            <Tabs.Screen
              name="home"
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="home" size={size} color={color} />
                ),
                title: 'Home',
              }}
              listeners={{
                tabPress: () => {
                  setSelectedDay(null);
                  setMode('week');
                },
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
        
        </SelectedTaskProvider>
      </AddNewProvider>
    </TimeLimitsProvider>

  );
}
