export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const X_API_KEY = process.env.NEXT_PUBLIC_X_API_KEY;
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
export const STRIPE_KEY = process.env.NEXT_PUBLIC_STRIPE_KEY;

export const NEXT_PUBLIC_APP_DESCRIPTION = "Hyre Health Customer";

export const DEFAULT_IMAGE_URL = "https://placehold.co/250x250/png";

export const CONSULTATION_FEE = 49;

export const PRODUCT_SORT_OPTIONS = [
  {
    label: "Name: A to Z",
    value: "name_asc",
  },
  {
    label: "Name: Z to A",
    value: "name_desc",
  },
  {
    label: "Price: Low to High",
    value: "price_low_high",
  },
  {
    label: "Price: High to Low",
    value: "price_high_low",
  },
  {
    label: "Rating",
    value: "rating",
  },
  {
    label: "Most Reviewed",
    value: "reviews",
  },
];
