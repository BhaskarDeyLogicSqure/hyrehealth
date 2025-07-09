// Payment method types
export type PaymentMethod = "card" | "ach" | "pay_later";

// Payment flow steps
export type PaymentFlow = "method-selection" | "card-payment" | "ach-payment" | "pay-later" | "processing" | "success" | "error";

// Card payment types
export interface Card {
  id: string;
  object: "card";
  last4: string;
  exp_month: number;
  exp_year: number;
  brand: string;
  isDefault: boolean;
  fingerprint?: string;
  funding?: string;
  country?: string;
}

export interface CardPaymentRequest {
  cardId?: string;
  token?: string;
  amount: number;
  currency?: string;
  description?: string;
}

export interface CardPaymentResponse {
  paymentId: string;
  status: string;
  amount: number;
  currency: string;
}

// ACH payment types
export enum AccountType {
  INDIVIDUAL = "individual",
  COMPANY = "company",
}

export interface AchAccountDetails {
  routingNumber: string;
  accountNumber: string;
  accountHolderType: AccountType;
  accountHolderName: string;
}

export interface AchTokenRequest {
  accountName: string;
  routingNumber: string;
  accountNumber: string;
  accountHolderType: AccountType;
  accountType: string;
}

export interface AchTokenResponse {
  token: string;
  sessionId: string;
  expiresAt: string;
}

export interface BankAccount {
  id: string;
  object: string;
  account_holder_name: string;
  account_holder_type: AccountType;
  account_type: string | null;
  bank_name: string;
  country: string;
  currency: string;
  customer: string;
  fingerprint: string;
  last4: string;
  metadata: Record<string, unknown>;
  routing_number: string;
  status: string;
}

export interface AchPaymentRequest {
  amount: number;
}

export interface AchPaymentResponse {
  paymentId: string;
  status: string;
  amount: number;
}

// Pay Later types
export interface PayLaterRequest {
  amount: number;
  dueDate: string;
  description?: string;
}

export interface PayLaterResponse {
  paymentId: string;
  dueDate: string;
  amount: number;
  status: "pending";
}

// General payment types
export interface PaymentDetails {
  orderId?: string;
  amount: number;
  currency: string;
  description?: string;
  customerEmail?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
  method: PaymentMethod;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
} 