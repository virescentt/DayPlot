// services/auth.js
import { SERVER_IP } from '../constants/services';

export const loginRequest = async (email, password) => {
  try {
    const response = await fetch(`http://${SERVER_IP}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    
    const data = await response.json();

    if (response.ok) {
      return { token: data.access_token };
    } else {
      return { token: false, message: data.message || 'Login failed' };
    }
  } catch (err) {
    console.error(err);
    return { token: false, message: 'Network error' };
  }
};


export const registerRequest = async (email, password) => {
  try {
    const response = await fetch(`http://${SERVER_IP}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, message: data.message };
    }
  } catch (err) {
    console.error(err);
    return { success: false, message: 'Network error' };
  }
};