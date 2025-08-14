import { httpType } from "@/api";

export const SIGN_UP_WITH_PAYMENT_ENDPOINT = {
  endpoint: "/signup-with-payment",
  httpType: httpType.POST,
};

// order checkout - for login users
export const ORDER_CHECKOUT_ENDPOINT = {
  endpoint: "/payment/products",
  httpType: httpType.POST,
};

// validate coupon
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

export const SUBMIT_INTAKE_FORM_QUESTIONS_ENDPOINT = {
  endpoint: "/intake-forms/store-responses",
  httpType: httpType.POST,
};

export const MEETING_DETAILS_ENDPOINT = {
  endpoint: "/meetinglink",
  httpType: httpType.GET,
};

export const RENEWAL_DETAILS_ENDPOINT = {
  endpoint: "/subscriptions",
  httpType: httpType.GET,
};
