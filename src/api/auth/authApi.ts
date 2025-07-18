import { ILoginResponseData, LoginCredentials } from "@/types/auth";
import { LOGIN_ENDPOINT } from "@/api-helper/AuthEndpoints";
import { ApiResponse } from "@/types";
import apiService from "..";

export const authApi = {
  login: async (
    payload: LoginCredentials
  ): Promise<ApiResponse<ILoginResponseData>> => {
    const response = await apiService.post(LOGIN_ENDPOINT?.endpoint, payload);

    return response?.data as ApiResponse<ILoginResponseData>;
  },
};
