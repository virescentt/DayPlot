import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState(''); // global email for login/register
  
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
      if (!res.ok) {
        await logout();
      }
      
      const data = await res.json();
      setUser(data);
    } catch (e) {
      console.log('loadUser error', e);
    }
  };


  const login = async (newToken) => {
    setLoading(true);
    try {
      await AsyncStorage.setItem('token', newToken);
      setToken(newToken);
      await loadUser(newToken);
      return true;
    } catch (e) {
      console.log('login error', e);
      await logout();
      return false;
    } finally{
      setLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  if (loading) {
    return null; 
  }
  return (
    <AuthContext.Provider value={{ email, setEmail, login, logout, token, loading, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};