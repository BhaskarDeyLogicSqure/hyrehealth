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

// merchant data types
export interface MerchantLegalDocument {
  id: string;
  _id: string;
  documentName: string;
  documentType: string;
  documentUrl?: string;
  documentDetailsHtmlText?: string;
}

export interface BusinessLogo {
  logoType: string;
  url: string;
}

export interface SocialMediaLink {
  _id: string;
  platform: string;
  url: string;
  id: string;
}

export interface CustomizeBranding {
  businessLogo: BusinessLogo;
  brandColor: string;
  accentColor: string;
  fontFamily: string;
  platformDisplayName: string;
  platformTagline: string;
  socialMediaLinks: SocialMediaLink[];
}

export interface MerchantNMIpaymentTokenResponse {
  error: boolean;
  data: {
    merchantOwnLegalDocuments: MerchantLegalDocument[];
    nmiMerchantApiKey: string;
    merchantAddress: string;
    merchantWebsiteName: string;
    merchantEmail: string;
    merchantName: string;
    supportEmail: string;
    // Branding fields
    businessName: string;
    customizeBranding: CustomizeBranding;
  };
}
