import { httpType } from "../services/http-services";
export interface EndpointConfigType {
  endpoint: string;
  httpType: httpType;
  attachToken?: boolean;
  attachXUserId?: boolean;
  query?: Record<string, unknown>;
}


export const GET_AWS_CREDENTIALS_ENDPOINT: EndpointConfigType = {
  endpoint: "/aws/credentials",
  httpType: httpType.GET,
  attachToken: true,
  attachXUserId: true,
};
// Authentication Endpoints
export const LOGIN_ENDPOINT: EndpointConfigType = {
  endpoint: "/login",
  httpType: httpType.POST,
  attachToken: false,
  attachXUserId: false,
};

// Order Management Endpoints
export const CREATE_DRAFT_ORDER_ENDPOINT: EndpointConfigType = {
  endpoint: "/orders/draft",
  httpType: httpType.POST,
  attachToken: true,
  attachXUserId: true,
};

export const UPDATE_ORDER_ENDPOINT: EndpointConfigType = {
  endpoint: "/orders",
  httpType: httpType.PUT,
  attachToken: true,
  attachXUserId: true,
};

export const GET_ORDER_ENDPOINT: EndpointConfigType = {
  endpoint: "/orders",
  httpType: httpType.GET,
  attachToken: true,
  attachXUserId: true,
};


// Settings Endpoints
export const GET_SETTINGS_ENDPOINT: EndpointConfigType = {
  endpoint: "/settings",
  httpType: httpType.GET,
  attachToken: false,
  attachXUserId: false,
};

export const UPDATE_SETTINGS_ENDPOINT: EndpointConfigType = {
  endpoint: "/settings",
  httpType: httpType.PUT,
  attachToken: true,
  attachXUserId: true,
};

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

export const GUEST_BULK_UPLOAD_RECIPIENTS_ENDPOINT: EndpointConfigType = {
  endpoint: "/guest/recipients/bulk-upload",
  httpType: httpType.POST,
  attachToken: false,
  attachXUserId: false,
};

export const BULK_UPLOAD_RECIPIENTS_ENDPOINT: EndpointConfigType = {
  endpoint: "/recipients/bulk-upload",
  httpType: httpType.POST,
  attachToken: true,
  attachXUserId: true,
};
