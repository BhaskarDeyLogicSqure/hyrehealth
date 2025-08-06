import {
  IForgotPasswordResponseData,
  ILoginResponseData,
  IResetPasswordResponseData,
  LoginCredentials,
} from "@/types/auth";
import {
  FORGOT_PASSWORD_ENDPOINT,
  LOGIN_ENDPOINT,
  RESET_PASSWORD_ENDPOINT,
} from "@/api-helper/AuthEndpoints";
import { ApiResponse } from "@/types";
import apiService from "..";

export const authApi = {
  login: async (
    payload: LoginCredentials
  ): Promise<ApiResponse<ILoginResponseData>> => {
    const response = await apiService.post(LOGIN_ENDPOINT?.endpoint, payload);

    return response?.data as ApiResponse<ILoginResponseData>;
  },

  forgotPassword: async (payload: {
    handle: string;
  }): Promise<ApiResponse<IForgotPasswordResponseData>> => {
    const response = await apiService.post(
      FORGOT_PASSWORD_ENDPOINT?.endpoint,
      payload
    );

    return response?.data as ApiResponse<IForgotPasswordResponseData>;
  },

  resetPassword: async (payload: {
    email: string;
    password: string;
    token: string;
  }): Promise<ApiResponse<IResetPasswordResponseData>> => {
    const response = await apiService.post(
      RESET_PASSWORD_ENDPOINT?.endpoint,
      payload
    );

    return response?.data as ApiResponse<IResetPasswordResponseData>;
  },
};
