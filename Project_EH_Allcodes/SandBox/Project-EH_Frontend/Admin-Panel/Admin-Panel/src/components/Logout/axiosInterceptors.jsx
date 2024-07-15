import axios from 'axios';

// Add a request interceptor
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('username');
      window.location.href = 'http://localhost:3001'; // Replace with your desired landing page route
    }
    return Promise.reject(error);
  }
);

export default axios;
