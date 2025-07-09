import { IAddress } from ".";

export interface ProfileFormData extends Partial<IAddress> {
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  company: string;
  companyName?: string;
  companyAddress?: string;
  companyWebsite?: string;
  companyLogo?: string;
  country: string;
  website: string;
  username?: string;
  accountType?: string;
  isAdmin?: boolean;
  role?: string;
  isActive?: boolean;
  status?: string;
  phoneCountry?: string;
}

export interface BrandingData {
  companyLogo: string;
  welcomeMessage: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface NotificationPreferences {
  emailDeliveryUpdates: boolean;
  campaignAlerts: boolean;
  weeklyReports: boolean;
}

export interface PortalFeatures {
  allowAddressChanges: boolean;
  enableCustomization: boolean;
  requireDeliveryConfirmation: boolean;
}
