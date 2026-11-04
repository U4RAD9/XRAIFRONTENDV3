import axios from 'axios';

// Points both Web and APK to production so all tracking and bookings sync to the same live database
// const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.xraidigital.com/api';

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const isNative = typeof window !== 'undefined' && Boolean(window.Capacitor?.isNativePlatform?.());
    const token = sessionStorage.getItem('Token') || (isNative ? localStorage.getItem('Token') : null);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

// old code 

// import axios from 'axios';

// // const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.xraidigital.com/api';
// const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
// // In native Android APK or production builds, connect to live API; in local dev browser, use localhost:8000
// const isNative = typeof Capacitor !== 'undefined' && typeof Capacitor.isNativePlatform === 'function' && Capacitor.isNativePlatform();
// const baseURL = import.meta.env.VITE_API_BASE_URL || (isNative || import.meta.env.PROD ? 'https://admin.xraidigital.com/api' : 'http://localhost:8000/api');

// const axiosInstance = axios.create({
//   baseURL,
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = sessionStorage.getItem('Token') || localStorage.getItem('Token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
