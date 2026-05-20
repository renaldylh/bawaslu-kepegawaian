import axios from "axios";
import { cookieHelper } from "./cookieHelper";

// Create axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3030",
  withCredentials: true, // Penting untuk mengirim cookies
});

// Request interceptor - otomatis tambahkan token dari cookie
apiClient.interceptors.request.use(
  (config) => {
    const token = cookieHelper.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token expiry
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      cookieHelper.removeAccessToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
