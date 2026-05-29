import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (err) => {
    if (err.response?.status === 401) {
      const refresh = localStorage.getItem('refreshToken');
      if (refresh) {
        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`, { refreshToken: refresh });
          localStorage.setItem('accessToken', res.data.accessToken);
          err.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return api(err.config);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(err);
  },
);
