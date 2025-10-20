import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // your backend base URL
});

// Add Authorization header if token exists
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('steeze_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
