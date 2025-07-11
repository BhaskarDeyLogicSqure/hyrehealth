// Types for middleware functionality
export interface MiddlewareConfig {
  protectedRoutes: string[];
  authRoutes: string[];
  publicRoutes: string[];
  themeRoutes: string[];
}

export interface AuthValidationResult {
  isValid: boolean;
  error?: string;
  shouldRefresh?: boolean;
}

export interface CookieConfig {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "strict" | "lax" | "none";
  maxAge: number;
  path: string;
}

export interface MiddlewareContext {
  pathname: string;
  startTime: number;
  hasToken: boolean;
  hasTheme: boolean;
}
