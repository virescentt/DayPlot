import { Alert } from "react-native";


export const changeName = (token, setUser, user) => {
    Alert.prompt(
      "Change Username",
      "Enter your new nickname",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Save", 
          onPress: async (newName) => {
            if (!newName) return;
            const res = await fetch('http://172.20.10.2:5000/user/update-name', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ name: newName })
            });
            if (res.ok) {
              const data = await res.json();
              setUser(prev => ({ ...prev, name: data.name }));
              alert('Username updated!');
            } else {
              alert('Failed to update name');
            }
          }
        }
      ],
      "plain-text",
      user?.name // текущее имя по умолчанию
    );
  };