import { httpType } from "@/api";
import { EndpointConfigType } from "./AuthEndpoints";

// Profile Endpoints
export const GET_PROFILE_ENDPOINT: EndpointConfigType = {
  endpoint: "/me",
  httpType: httpType.GET,
  attachToken: true,
  attachXUserId: true,
};

export const UPDATE_PROFILE_ENDPOINT: EndpointConfigType = {
  endpoint: "/update/profile",
  httpType: httpType.PUT,
  attachToken: true,
  attachXUserId: true,
};

// subscriptions
export const GET_USER_SUBSCRIPTIONS: EndpointConfigType = {
  endpoint: "/subscriptions",
  httpType: httpType.PUT,
  attachToken: true,
  attachXUserId: true,
};
