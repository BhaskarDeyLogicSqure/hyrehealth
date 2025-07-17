export interface Product {
  _id: string;
  name: string;
  isPopular: boolean;
  category: {
    _id: string;
    name: string;
  }[];
  form?: string;
  contentAndDescription: {
    shortDescription: string;
    longDescription?: string;
  };
  media: {
    images: {
      url: string;
      alt?: string;
      isPrimary?: boolean;
      _id?: string;
    }[];
  };
  pricing: {
    basePrice: number;
    compareAtPrice: number;
    subscriptionOptions?: any[];
  };
  reviews: {
    _id: string;
    rating: number;
    review: string;
    createdAt: string;
    updatedAt: string;
  }[];
  rating: number;
  createdAt: string;
  updatedAt: string;
}
