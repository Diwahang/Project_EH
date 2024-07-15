// src/auth/auth.js

export const verifyToken = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return false; // Token not found
    }
  
    // Optionally, you can decode or verify the token here if needed
  
    return true; // Token found and valid
  };
  