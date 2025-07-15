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
