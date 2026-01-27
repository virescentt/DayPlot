// services/auth.js
export const loginRequest = async (email, password) => {
  try {
    const response = await fetch('http://172.20.10.2:5000/auth/login', {
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
    const response = await fetch('http://172.20.10.2:5000/auth/register', {
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