import { ApiResponse, IAwsCredentials } from "@/types";
import { BASE_URL } from "@/configs";
import apiService from "..";
import { GET_AWS_CREDENTIALS_ENDPOINT } from "@/api-helper/GeneralEndpoints";

export interface AwsCredentialsResponse {
  success: boolean;
  credentials: {
    region: string;
    bucket: string;
    AccessKeyId: string;
    SecretAccessKey: string;
    SessionToken: string;
    Expiration: string;
    folderPrefix?: string;
  };
}

export const awsApi = {
  fetchAwsCredentials: async (
    folderPrefix: string = ""
  ): Promise<ApiResponse<IAwsCredentials>> => {
    const response = await apiService?.get<any>(
      `${BASE_URL}${GET_AWS_CREDENTIALS_ENDPOINT?.endpoint}?folderPrefix=${folderPrefix}`
    );
    console.log("response >>", response?.data);
    return response?.data;
  },
};
