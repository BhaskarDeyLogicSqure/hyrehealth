/* eslint-disable @typescript-eslint/no-explicit-any */
import { BASE_URL } from "@/configs";
import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { getTokenFromCookie } from "@/utils/auth";

export enum httpType {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include token for all requests(if token is present, i.e protected routes)
axiosInstance.interceptors.request.use((config) => {
  const token = getTokenFromCookie();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Standard API response format
export interface ApiResponse<T> {
  error?: any;
  data: T;
  status: number;
}

// ✅ Standard API error format
export interface ApiError {
  message: string;
  success?: boolean;
  status?: number;
}

// ✅ Centralized error handling
function handleError(error: AxiosError | Error): never {
  if (axios.isAxiosError(error)) {
    throw {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      success: error.response?.data?.success || false,
    } as ApiError;
  }

  throw { message: error?.message || "Something went wrong" } as ApiError;
}

// ✅ Simplified API methods
const apiService = {
  get: async <T>(
    endpoint: string,
    params?: object,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const response = await axiosInstance.get<T>(endpoint, {
        ...config,
        params,
      });
      // return { data: response?.data, status: response?.status };
      return response?.data;
    } catch (err) {
      handleError(err as AxiosError);
    }
  },

  post: async <T>(
    endpoint: string,
    payload?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.post<T>(endpoint, payload, config);
      return { data: response?.data, status: response?.status };
    } catch (err) {
      handleError(err as AxiosError);
    }
  },

  put: async <T>(
    endpoint: string,
    payload?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.put<T>(endpoint, payload, config);
      return { data: response?.data, status: response?.status };
    } catch (err) {
      handleError(err as AxiosError);
    }
  },

  patch: async <T>(
    endpoint: string,
    payload?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.patch<T>(endpoint, payload, config);
      return { data: response?.data, status: response?.status };
    } catch (err) {
      handleError(err as AxiosError);
    }
  },

  delete: async <T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.delete<T>(endpoint, config);
      return { data: response?.data, status: response?.status };
    } catch (err) {
      handleError(err as AxiosError);
    }
  },
};

export default apiService;
