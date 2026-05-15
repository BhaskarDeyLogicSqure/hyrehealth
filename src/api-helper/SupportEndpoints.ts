import { httpType } from "@/api";
import { EndpointConfigType } from "./AuthEndpoints";

export const CREATE_ORDER_SUPPORT: EndpointConfigType = {
  endpoint: "/support/order",
  httpType: httpType.POST,
  attachToken: true,
  attachXUserId: true,
};

export const GET_ORDER_SUPPORT: EndpointConfigType = {
  endpoint: "/support/order",
  httpType: httpType.GET,
  attachToken: true,
  attachXUserId: true,
};
