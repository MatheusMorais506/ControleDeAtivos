import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://backend:5000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // envia cookies automaticamente
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor de resposta para refresh automático
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // evita loop infinito

      try {
        await api.post('/refresh'); // chama refresh
        return api(originalRequest); // repete a requisição original
      } catch (refreshError) {
        // Refresh token inválido, redirecione para login ou trate erro
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
