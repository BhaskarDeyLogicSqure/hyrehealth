import {
  IForgotPasswordResponseData,
  ILoginResponseData,
  IResetPasswordResponseData,
  LoginCredentials,
  MerchantNMIpaymentTokenResponse,
} from "@/types/auth";
import {
  FORGOT_PASSWORD_ENDPOINT,
  LOGIN_ENDPOINT,
  RESET_PASSWORD_ENDPOINT,
} from "@/api-helper/AuthEndpoints";
import { ApiResponse } from "@/types";
import apiService from "..";
import { MERCHANT_NMI_PAYMENT_TOKEN_ENDPOINT } from "@/api-helper/ChekoutEndpoints";

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
    try {
      const response = await apiService.post(
        FORGOT_PASSWORD_ENDPOINT?.endpoint,
        payload
      );

      return response?.data as ApiResponse<IForgotPasswordResponseData>;
    } catch (error) {
      throw error;
    }
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

  // get footer details and NMI merchant token

  // get merchant's NMI payment token for payment processing
  getMerchantNMITokenizationKey:
    async (): Promise<MerchantNMIpaymentTokenResponse> => {
      try {
        const response = await apiService.get<MerchantNMIpaymentTokenResponse>(
          `${MERCHANT_NMI_PAYMENT_TOKEN_ENDPOINT.endpoint}`
        );

        return {
          error: response?.error || false,
          data: response?.data,
        };
      } catch (error) {
        console.error("Merchant NMI tokenization key API error:", error);
        throw error;
      }
    },
};
