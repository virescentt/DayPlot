import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState(''); // global email for login/registr
  
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        await loadUser(storedToken);
      }
      setLoading(false);
    };

    loadToken();
  }, []);

  const loadUser = async (token) => {
    try {
      const res = await fetch('http://172.20.10.2:5000/user/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (e) {
      console.log('loadUser error', e);
    }
  };


  const login = async (newToken) => {
    await AsyncStorage.setItem('token', newToken);
    setToken(newToken);
    await loadUser(newToken);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };


  return (
    <AuthContext.Provider value={{ email, setEmail, login, logout, token, loading, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};