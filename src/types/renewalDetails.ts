export interface RenewalDetail {
  currentTreatment: CurrentTreatment;
  extensionPlans: ExtensionPlan[];
  pageHeader: PageHeader;
  additionalInfo: AdditionalInfo;
  subscription: SubscriptionInfo;
}

export interface CurrentTreatment {
  product: string;
  currentDosage: string;
  strength: string;
  lastConsultation: string;
  status: string;
  subscriptionNumber: string;
}

export interface ExtensionPlan {
  id: string;
  name: string;
  badge: string;
  price: number;
  originalPrice: number;
  duration: number;
  durationUnit: string;
  estimatedDelivery: string;
  savings: number;
  isPopular: boolean;
  isBestValue: boolean;
  strength: number;
  isDefault: boolean;
}

export interface PageHeader {
  title: string;
  subtitle: string;
}

export interface AdditionalInfo {
  lastApprovedDosage: string;
  dosageNote: string;
  canRenew: boolean;
  renewalReason: string;
}

export interface MerchantInfo {
  firstName: string;
  lastName: string;
  businessName: string;
}

export interface PharmacyInfo {
  firstName: string;
  lastName: string;
  businessName: string;
}

export interface SubscriptionInfo {
  id: string;
  status: string;
  merchant: MerchantInfo;
  pharmacy: PharmacyInfo;
}

export interface RenewalDetail {
  _id: string;
  subscriptionId: string;
  renewalDate: string;
  renewalAmount: number;
  renewalStatus: string;

  currentTreatment: CurrentTreatment;
  extensionPlans: ExtensionPlan[];
  pageHeader: PageHeader;
  additionalInfo: AdditionalInfo;
  subscription: SubscriptionInfo;
}

export interface RenewalDetailsPageData {
  currentTreatment: CurrentTreatment;
  extensionPlans: ExtensionPlan[];
  pageHeader: PageHeader;
  additionalInfo: AdditionalInfo;
  subscription: SubscriptionInfo;
}

export interface RenewalDetailsResponse {
  error: boolean;
  data: {
    renewalDetails: Array<RenewalDetail>;
  };
}
