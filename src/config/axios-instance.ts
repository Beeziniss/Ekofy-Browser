import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_ENDPOINT,
  withCredentials: true,
});

export default axiosInstance;
