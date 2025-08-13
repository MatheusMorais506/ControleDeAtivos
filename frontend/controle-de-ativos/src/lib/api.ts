import axios from 'axios';
import { navigate } from './navegacao';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://backend:5000';

let currentPath = '/';
export function setCurrentPath(path: string) {
  currentPath = path;
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/refresh') &&
      currentPath !== '/login' &&
      currentPath !== '/'
    ) {
      originalRequest._retry = true;
      try {
        await api.post('/api/Autenticacao/refresh');
        return api(originalRequest);
      } catch (refreshError) {
        navigate('/login'); 
        return { data: null, status: 401 };
      }
    }

    return Promise.reject(err);
  }
);


export default api;
