// axiosInstance.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const baseURL = "https://arogyadham.giksindia.com/app/v1/"
const loginBaseURL = "https://admin.arogyapath.in/api/"

const axiosAuth = axios.create({
  baseURL: baseURL, // Replace with your API base URL
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
    baseURL: baseURL, // Replace with your API base URL
  });

const axiosLogin = axios.create({
    baseURL: loginBaseURL, // For login API only
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
