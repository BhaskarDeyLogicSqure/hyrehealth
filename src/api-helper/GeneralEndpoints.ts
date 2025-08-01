import { httpType } from "@/api";

export const GET_AWS_CREDENTIALS_ENDPOINT = {
  endpoint: "/awstempcreds",
  httpType: httpType.GET,
  attachToken: true,
  attachXUserId: true,
};
