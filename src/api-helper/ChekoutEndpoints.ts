import { httpType } from "@/api";

export const SIGN_UP_WITH_PAYMENT_ENDPOINT = {
  endpoint: "/signup-with-payment",
  httpType: httpType.POST,
};

export const VALIDATE_COUPON_ENDPOINT = {
  endpoint: "/coupons/validate",
  httpType: httpType.POST,
};

export const ORDER_CONFIRMATION_DETAILS_ENDPOINT = {
  endpoint: "/invoice",
  httpType: httpType.GET,
};

export const INTAKE_FORM_QUESTIONS_ENDPOINT = {
  endpoint: "/intake-forms",
  httpType: httpType.GET,
};
