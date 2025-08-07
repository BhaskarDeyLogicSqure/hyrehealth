export interface MedicalInformation {
  allergies: string[];
  currentMedications: string[];
  medicalConditions: string[];
  pregnancyStatus: string;
}

export interface LoginDetail {
  loginAt: string;
  lastLoginIP?: string;
  userAgent?: string;
  expiresAt?: string;
  loginMerchantFor?: string;
  _id?: string;
  id?: string;
}

export interface Address {
  addressLine1: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
  _id?: string;
  id?: string;
}

export interface Subscription {
  subscriptionId: string;
  _id?: string;
  id?: string;
}

export interface Name {
  full: string;
}

export interface UserDataType {
  _id?: string;
  id?: string;
  email: string;
  username?: string;
  firstName: string;
  fullName?: string;
  lastName: string;
  isAdmin?: boolean;
  isActive?: boolean;
  userType?: string;
  accountType?: string;
  phone?: string;
  dob?: string;
  amountSpent?: number;
  medicalInformation?: MedicalInformation;
  loginDetails?: LoginDetail[];
  shippingAddresses?: Address[];
  billingAddresses?: Address[];
  paymentMethods?: any[];
  subscriptions?: Subscription[];
  associatedMerchant?: string;
  couponsCodeUsed?: string[];
  intakeFormResponses?: any[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  lastActive?: string;
  name?: Name;
}
