import { httpType } from "@/api";

export interface EndpointConfigType {
  endpoint: string;
  httpType: httpType;
  attachToken?: boolean;
  attachXUserId?: boolean;
  query?: Record<string, unknown>;
}

// Authentication Endpoints
export const LOGIN_ENDPOINT: EndpointConfigType = {
  endpoint: "/login",
  httpType: httpType.POST,
  attachToken: false,
  attachXUserId: false,
};

export const FORGOT_PASSWORD_ENDPOINT: EndpointConfigType = {
  endpoint: "/forgotpassword",
  httpType: httpType.POST,
  attachToken: false,
  attachXUserId: false,
};

export const RESET_PASSWORD_ENDPOINT: EndpointConfigType = {
  endpoint: "/resetpassword",
  httpType: httpType.POST,
  attachToken: false,
  attachXUserId: false,
};
