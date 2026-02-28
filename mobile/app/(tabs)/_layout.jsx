import { Tabs } from 'expo-router';
import { useRef, useState } from 'react'; 
import { Ionicons, Feather } from '@expo/vector-icons';
import { TasksContext } from '../../context/TasksContext';
import { useContext } from 'react';
import { AddNewProvider } from '../../context/AddNewContext';


export default function TabsLayout() {
  const { setMode, setSelectedDay } = useContext(TasksContext);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const BottomSheetRef = useRef(null);

  
  const openSheet = () => {
    BottomSheetRef.current?.expand();
    console.log(BottomSheetRef.current, "EXPANDDDD PLEAAAASE")
  };

  return (
    <AddNewProvider>
      <Tabs screenOptions={{
          headerShown: false, // 👈 ЭТО УБИРАЕТ ШАПКУ ВО ВСЕХ ТАБАХ
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
          // listeners={{
          //   tabPress: (e) => {
          //     e.preventDefault(); // отменяем обычный переход
          //     openSheet();
          //   },
          // }}
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
        
    </AddNewProvider>
  );
}
