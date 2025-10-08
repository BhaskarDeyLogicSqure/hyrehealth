export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const X_API_KEY = process.env.NEXT_PUBLIC_X_API_KEY;
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
export const STRIPE_KEY = process.env.NEXT_PUBLIC_STRIPE_KEY;

export const testTheme = "classic";
// app description
export const APP_DESCRIPTION = "Hyre Health Customer";

// default image url, can be used as a placeholder image
export const DEFAULT_IMAGE_URL = "https://placehold.co/250x250/png";

// consultation fee
export const CONSULTATION_FEE = 49;

// Navigation items for the main menu
export const navigationItems = [
  { name: "Treatments", href: "/categories" },
  { name: "All Products", href: "/products" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Support", href: "/support" },
];

// product sort options for products list
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

// pagination and display settings
export const FEATURED_CATEGORIES_LIMIT = 3;
export const CATEGORIES_PER_PAGE = 6;
export const DIGITS_AFTER_DECIMALS = 2;
export const STALE_TIME_FOR_REACT_QUERY = 5 * 60 * 1000; // 5 minutes;

// date formats
export const READABLE_DATE_FORMAT = "MMM D, YYYY";
export const US_SHORT_DATE_FORMAT = "MM/DD/YYYY";
export const US_DATE_TIME_FORMAT = "MM/DD/YYYY HH:mm:ss";

// support contact info
export const SUPPORT_EMAIL = "support@hyrehealth.com";
export const SUPPORT_PHONE_NUMBER = "+1 1234567890";

// theme colors for categories
export const DEFAULT_THEME_CATEGORIES_COLORS = [
  "bg-blue-50 text-blue-600 border-blue-200",
  "bg-purple-50 text-purple-600 border-purple-200",
  "bg-green-50 text-green-600 border-green-200",
  "bg-red-50 text-red-600 border-red-200",
  "bg-orange-50 text-orange-600 border-orange-200",
  "bg-indigo-50 text-indigo-600 border-indigo-200",
];
