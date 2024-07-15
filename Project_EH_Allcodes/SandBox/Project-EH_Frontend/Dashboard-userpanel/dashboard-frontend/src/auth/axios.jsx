// src/auth/axios.js

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/login/', // Replace with your API URL
});

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default axiosInstance;
