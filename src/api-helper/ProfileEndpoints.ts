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

export const GET_ALL_INVOICES: EndpointConfigType = {
  endpoint: "/invoices",
  httpType: httpType.GET,
  attachToken: true,
  attachXUserId: true,
};

export const GET_SINGLE_PRODUCT_REVIEW: EndpointConfigType = {
  endpoint: "/reviews/product",
  httpType: httpType.GET,
  attachToken: true,
  attachXUserId: true,
};

export const CREATE_REVIEW_FOR_PRODUCT: EndpointConfigType = {
  endpoint: "/reviews",
  httpType: httpType.POST,
  attachToken: true,
  attachXUserId: true,
};
