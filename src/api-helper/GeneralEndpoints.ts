import { httpType } from "@/services/http-services";
import { EndpointConfigType } from "./AuthEndpoints";

export const GET_AWS_CREDENTIALS_ENDPOINT: EndpointConfigType = {
  endpoint: "/aws/credentials",
  httpType: httpType.GET,
  attachToken: true,
  attachXUserId: true,
};
