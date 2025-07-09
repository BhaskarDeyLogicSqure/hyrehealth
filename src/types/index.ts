import { UserDataType } from "./user";

// Auth types
export interface AuthState {
  user: UserDataType | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Global Address Validation
export interface IAddress {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

// Gift Box types
export interface GiftBoxItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}

export interface IGiftBox {
  id: string;
  name: string;
  description: string;
  boxCoverImage: string;
  items: GiftBoxItem[];
  category: string;
  tags: string[];
  size: string;
  basePrice: number;
  theme: string;
  isCustom: boolean;
  isDigital: boolean;
  isPhysical: boolean;
}

// Cart types
export interface CartItem {
  id: string;
  giftBoxId: string;
  name: string;
  price: number;
  quantity: number;
  customizations?: {
    message?: string;
    branding?: string;
    additionalItems?: string[];
  };
}

// Recipient types
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// AWS Credentials Response Type
export interface IAwsCredentials {
  region: string;
  bucket: string;
  AccessKeyId: string;
  SecretAccessKey: string;
  SessionToken: string;
  Expiration: string;
  folderPrefix?: string;
}

// API types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
}

export type PaginationType = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export interface ApiResponseWithPagination<T> extends ApiResponse<T> {
  pagination: PaginationType;
}

export interface ApiError {
  success: boolean;
  message: string;
}

export interface GlobalAddress extends IAddress {
  formattedAddress?: string;
}

export interface GlobalAddressValidationErrors {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

// Re-export other types for convenience
export * from "./payment";
export * from "./user";
export * from "./auth";
export * from "./profile";
