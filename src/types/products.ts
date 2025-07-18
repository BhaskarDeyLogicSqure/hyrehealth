export interface Product {
  _id: string;
  name: string;
  isPopular: boolean;
  category: {
    _id: string;
    name: string;
  }[];
  sku?: string;
  productTags?: string[];
  form?: string;
  importantInformation?: string;
  contentAndDescription: {
    shortDescription: string;
    longDescription?: string;
    description?: string;
    benefits?: string[];
    sideEffects?: string[];
    requiresPrescription?: boolean;
    isFdaApproved?: boolean;
    isFreeShipping?: boolean;
    isLicensedPhysician?: boolean;
    ingredientsOrComposition?: any[];
    howToUse?: string;
    faqs?: any[];
    shippingAndReturnPolicy?: string;
    extraInformations?: any[];
  };
  media: {
    images: {
      url: string;
      alt?: string;
      isPrimary?: boolean;
      _id?: string;
    }[];
    videos?: any[];
    documents?: any[];
  };
  isSystemLevelProduct?: boolean;
  merchant?: string;
  status?: string;
  pricing: {
    basePrice: number;
    compareAtPrice: number;
    subscriptionOptions?: any[];
  };
  intakeFormRequirements?: {
    requiredQuestions?: any[];
  };
  similarProducts?: any[];
  statistics?: {
    totalSales?: number;
    viewCount?: number;
    averageRating?: number;
    reviewCount?: number;
  };
  merchantSpecific?: boolean;
  strengthPrices?: any[];
  reviews?: {
    _id: string;
    rating: number;
    review: string;
    createdAt: string;
    updatedAt: string;
  }[];
  rating?: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}
