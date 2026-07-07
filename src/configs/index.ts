export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const X_API_KEY = process.env.NEXT_PUBLIC_X_API_KEY;
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
export const STRIPE_KEY = process.env.NEXT_PUBLIC_STRIPE_KEY;
export const CHECKOUT_PAYMENT_METHOD =
  process.env.NEXT_PUBLIC_CHECKOUT_PAYMENT_METHOD;

export const testTheme = "classic";
// app description
export const APP_DESCRIPTION = "Hyre Health Customer";

// default image url, can be used as a placeholder image
export const DEFAULT_IMAGE_URL = "https://placehold.co/250x250/png";

// consultation fee
export const CONSULTATION_FEE = 50;

/**
 * Payment / pricing implementation a merchant runs on the product + checkout pages.
 * - "current": show a price range; charge only the flat appointment fee
 *   (CONSULTATION_FEE) up front, medication billed later via the Qualiphy webhook.
 * - "previous": user picks a dosage + duration combo and pays the exact combo total.
 *
 * This will eventually come from the `/payment/merchant-nmi-key` API
 * (merchantData.paymentFlow). Until the backend sends it, we fall back to
 * PAYMENT_FLOW_OVERRIDE (env) and then DEFAULT_PAYMENT_FLOW.
 */
export type PaymentFlowType = "current" | "previous";
export const DEFAULT_PAYMENT_FLOW: PaymentFlowType = "current";
export const PAYMENT_FLOW_OVERRIDE = process.env.NEXT_PUBLIC_PAYMENT_FLOW as
  | PaymentFlowType
  | undefined;

// The key on the `/payment/merchant-nmi-key` response that carries the flow.
// (We set it ourselves for now; the backend will send it here later.)
export const MERCHANT_PAYMENT_FLOW_KEY = "paymentFlow";

export const isValidPaymentFlow = (value: unknown): value is PaymentFlowType =>
  value === "current" || value === "previous";

/**
 * Resolves the effective payment flow. Precedence:
 *   1. the value from the merchant API (once the backend sends it),
 *   2. the NEXT_PUBLIC_PAYMENT_FLOW env override (handy for local testing),
 *   3. DEFAULT_PAYMENT_FLOW.
 */
export const resolvePaymentFlow = (value?: unknown): PaymentFlowType => {
  if (isValidPaymentFlow(value)) return value;
  if (isValidPaymentFlow(PAYMENT_FLOW_OVERRIDE)) return PAYMENT_FLOW_OVERRIDE;
  return DEFAULT_PAYMENT_FLOW;
};

// Navigation items for the main menu
export const navigationItems = [
  { name: "Categories", href: "/categories" },
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
