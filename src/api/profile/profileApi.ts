import {
  GET_PROFILE_ENDPOINT,
  GET_USER_SUBSCRIPTIONS,
} from "@/api-helper/ProfileEndpoints";
import apiService from "..";

export const profileApi = {
  getProfile: async () => {
    const response = await apiService.get<{
      data: any;
      error: boolean;
    }>(GET_PROFILE_ENDPOINT.endpoint);
    if (response?.error) {
      throw new Error("Failed to load profile");
    }

    return response?.data;
  },

  getUserSubscriptions: async () => {
    const response = await apiService.get<{
      data: any;
      error: boolean;
    }>(GET_USER_SUBSCRIPTIONS.endpoint);
    if (response?.error) {
      throw new Error("Failed to load profile");
    }

    return response?.data;
  },
};
