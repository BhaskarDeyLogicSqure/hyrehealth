import { UserDataType } from "./user";

export interface LoginCredentials {
  handle: string;
  password: string;
}

export interface ILoginResponseData {
  user: UserDataType;
  token: string;
}

export interface IForgotPasswordResponseData {
  error: boolean;
  message?: string;
  reason?: string;
  handle?: string;
}

export interface IResetPasswordResponseData {
  error: boolean;
  message?: string;
  reason?: string;
  email?: string;
  handle?: string;
}

export interface MerchantLegalDocument {
  id: string;
  _id: string;
  documentName: string;
  documentType: string;
  documentUrl?: string;
  documentDetailsHtmlText?: string;
}

export interface MerchantNMIpaymentTokenResponse {
  error: boolean;
  data: {
    merchantOwnLegalDocuments: MerchantLegalDocument[];
    nmiMerchantApiKey: string;
  };
}
