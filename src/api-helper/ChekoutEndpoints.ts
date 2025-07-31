import { httpType } from "@/api";

export const SIGN_UP_WITH_PAYMENT_ENDPOINT = {
  endpoint: "/signup-with-payments",
  httpType: httpType.POST,
  attachToken: true,
  attachXUserId: true,
};
