import { BASE_URL } from "@/configs";
import axios from "axios";
import { getTokenFromCookie } from "@/utils/auth";

const apiService = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include token
apiService.interceptors.request.use((config) => {
  const token = getTokenFromCookie();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiService;