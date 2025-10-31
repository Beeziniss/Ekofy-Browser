import axios from "axios";
import { getAccessTokenFromLocalStorage } from "@/utils/auth-utils";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
  withCredentials: true,
});

// Add request interceptor to include Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessTokenFromLocalStorage();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
