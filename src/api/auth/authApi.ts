import axios from "axios";
import { ILoginResponseData, LoginCredentials } from "@/types/auth";
import { LOGIN_ENDPOINT } from "@/api-helper/AuthEndpoints";
import { ApiResponse } from "@/types";
import { BASE_URL } from "@/configs";

export const authApi = {
  login: async (
    credentials: LoginCredentials
  ): Promise<ApiResponse<ILoginResponseData>> => {
    const response = await axios.post(
      BASE_URL + LOGIN_ENDPOINT.endpoint,
      credentials
    );
    return response.data;
  },
};
