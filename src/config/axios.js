// axiosInstance.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const baseURL = "https://admin.arogyapath.in/api/"

const axiosAuth = axios.create({
  baseURL: baseURL,
});

axiosAuth.interceptors.request.use(
  async (config) => {
    let token = await AsyncStorage.getItem('X-ACCESS-TOKEN');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const axiosLocal = axios.create({
  baseURL: baseURL,
});

axiosLocal.interceptors.request.use(
  async (config) => {
    console.log('Request:', config);
    return config;
  },
  (error) => {
    console.log('Request Error:', error);
    return Promise.reject(error);
  }
);

axiosLocal.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    console.log('Response Error:', error);
    return Promise.reject(error);
  }
);

export { axiosAuth, axiosLocal, baseURL };