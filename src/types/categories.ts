export interface Category {
  _id: string;
  id: string;
  statistics: {
    productCount: number;
    viewCount: number;
  };
  isSystemCategory: boolean;
  categoryFor: string[];
  displayOrder: number;
  merchantSpecific: boolean;
  merchant: any | null;
  products: any[];
  __v: number;
  businessTypes: string[];
  name: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isPopular: boolean;
}
