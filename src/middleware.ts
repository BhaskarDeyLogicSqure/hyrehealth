// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import {
  AVAILABLE_THEMES,
  DEFAULT_THEME,
  isValidTheme,
} from "@/lib/theme-utils";
import type {
  MiddlewareConfig,
  AuthValidationResult,
  CookieConfig,
} from "@/types/middleware";
import axios from "axios";
import { Theme } from "./types/theme";

// Configuration - easily extensible
const MIDDLEWARE_CONFIG: MiddlewareConfig = {
  protectedRoutes: [
    "/profile",
    "/intake-form",
    "/pre-consultation",
    "/post-consultation-summary",
    "/consultation-renewal",
  ],
  authRoutes: ["/auth/login", "/auth/forgot-password"],
  publicRoutes: [
    "/",
    "/categories",
    "/products",
    "/checkout",
    "/privacy",
    "/checkout",
  ],
  themeRoutes: ["/"], // Only apply theme logic to specific routes if needed
};

// Cookie security configuration
const THEME_COOKIE_OPTIONS: CookieConfig = {
  httpOnly: false, // Theme needs to be accessible by client-side for styling
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 30, // 30 days
  path: "/",
};

// const AUTH_COOKIE_OPTIONS: CookieConfig = {
//   httpOnly: true, // Auth tokens should be httpOnly for security
//   secure: process.env.NODE_ENV === "production",
//   sameSite: "lax",
//   maxAge: 60 * 60 * 24 * 7, // 7 days
//   path: "/",
// };

// Logger utility with environment awareness
class MiddlewareLogger {
  private isDevelopment = process.env.NODE_ENV === "development";

  info(message: string, data?: any) {
    if (this.isDevelopment) {
      console.log(`[Middleware] ${message}`, data || "");
    }
  }

  error(message: string, error?: any) {
    if (this.isDevelopment) {
      console.error(`[Middleware Error] ${message}`, error || "");
    }
  }

  warn(message: string, data?: any) {
    if (this.isDevelopment) {
      console.warn(`[Middleware Warning] ${message}`, data || "");
    }
  }
}

const logger = new MiddlewareLogger();

// Route utility functions
class RouteChecker {
  static isProtectedRoute(pathname: string): boolean {
    return MIDDLEWARE_CONFIG?.protectedRoutes?.some((route) =>
      pathname?.startsWith(route)
    );
  }

  static isAuthRoute(pathname: string): boolean {
    return MIDDLEWARE_CONFIG?.authRoutes?.some((route) =>
      pathname?.startsWith(route)
    );
  }

  static isPublicRoute(pathname: string): boolean {
    return MIDDLEWARE_CONFIG?.publicRoutes?.some(
      (route) => pathname === route || pathname?.startsWith(route + "/")
    );
  }

  static needsThemeCheck(pathname: string): boolean {
    // Only check theme for routes that actually need it
    return (
      !pathname?.startsWith("/api") &&
      !pathname?.startsWith("/_next") &&
      !pathname?.includes(".")
    );
  }
}

// Token validation utility
class AuthValidator {
  static async validateToken(token: string): Promise<AuthValidationResult> {
    try {
      // Basic token format validation
      if (!token || token?.length < 10) {
        return { isValid: false, error: "Invalid token format" };
      }

      // TODO: Implement actual token validation
      // This could include:
      // - JWT verification
      // - API call to auth service
      // - Token expiry check

      // For now, return true for any non-empty token
      // In production, replace with actual validation logic
      return { isValid: true };
    } catch (error) {
      logger.error("Token validation failed", error);
      return { isValid: false, error: "Token validation error" };
    }
  }
}

// Theme management utility
class ThemeManager {
  static async getTheme(request: NextRequest): Promise<Theme> {
    try {
      // Check if theme cookie already exists
      const existingTheme = request.cookies.get("theme")?.value;

      if (existingTheme && isValidTheme(existingTheme)) {
        logger.info("Using existing theme from cookie", {
          theme: existingTheme,
        });
        return existingTheme;
      }

      // Get the base URL from environment variable
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

      if (!baseUrl) {
        logger.warn("NEXT_PUBLIC_BASE_URL not configured, using default theme");
        return DEFAULT_THEME;
      }

      // Construct the full API URL
      const apiUrl = `${baseUrl}/payment/merchant-nmi-key`;

      // Get origin from request for security headers
      const origin = request.nextUrl.origin || baseUrl;
      const referer = request.url;

      logger.info("Fetching theme from API", { apiUrl, origin });

      // Make the API call to get merchant details including theme
      const themeResponse = await axios.get(apiUrl, {
        timeout: 5000, // 5 second timeout
        headers: {
          "Content-Type": "application/json",
          Origin: origin,
          Referer: referer,
        },
      });

      // Extract theme from response
      const themeValue = themeResponse?.data?.data?.selectedTemplateType;

      logger.info("Theme fetched from API", {
        theme: themeValue,
        availableThemes: AVAILABLE_THEMES,
        isValid: themeValue && isValidTheme(themeValue),
      });

      // Validate the theme
      if (themeValue && isValidTheme(themeValue)) {
        logger.info("Valid theme received from API", { theme: themeValue });
        return themeValue;
      }

      logger.warn("Invalid or missing theme from API, using default", {
        receivedTheme: themeValue,
        defaultTheme: DEFAULT_THEME,
      });
      return DEFAULT_THEME;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Unknown error";
      const statusCode = error?.response?.status;

      logger.error("Failed to fetch theme from API", {
        error: errorMessage,
        statusCode,
        fallbackTheme: DEFAULT_THEME,
      });

      return DEFAULT_THEME;
    }
  }

  static setThemeCookie(response: NextResponse, theme: Theme): void {
    response.cookies.set("theme", theme, THEME_COOKIE_OPTIONS);
    logger.info("Theme cookie set", { theme });
  }
}

// Main middleware handlers
class MiddlewareHandlers {
  static async handleThemeLogic(
    request: NextRequest
  ): Promise<NextResponse | null> {
    try {
      const { pathname } = request.nextUrl;

      // Skip theme logic for routes that don't need it
      if (!RouteChecker.needsThemeCheck(pathname)) {
        return null;
      }

      // Check if theme cookie already exists
      const existingTheme = request.cookies.get("theme");
      if (existingTheme) {
        return null; // Continue with existing theme
      }

      logger.info("Setting theme for new user", { pathname });

      // Get theme and set cookie
      const theme = await ThemeManager.getTheme(request);
      const response = NextResponse.next();
      ThemeManager.setThemeCookie(response, theme);

      return response;
    } catch (error) {
      logger.error("Theme logic error", error);
      return null; // Continue without theme logic
    }
  }

  static async handleProtectedRoute(
    request: NextRequest
  ): Promise<NextResponse | null> {
    try {
      const { pathname } = request.nextUrl;

      if (!RouteChecker.isProtectedRoute(pathname)) {
        return null;
      }

      logger.info("Checking protected route access", { pathname });

      const customerToken = request.cookies.get("customer-token")?.value;

      if (!customerToken) {
        logger.info("No token found, redirecting to login");
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }

      // Validate token
      const validation = await AuthValidator.validateToken(customerToken);

      if (!validation.isValid) {
        logger.warn("Invalid token, redirecting to login", {
          error: validation.error,
        });

        // Clear invalid token
        const response = NextResponse.redirect(
          new URL("/auth/login", request.url)
        );
        response.cookies.delete("customer-token");
        return response;
      }

      logger.info("Valid token, allowing access to protected route");
      return null; // Continue to protected route
    } catch (error) {
      logger.error("Protected route handler error", error);
      // On error, redirect to login for security
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  static async handleAuthRoute(
    request: NextRequest
  ): Promise<NextResponse | null> {
    try {
      const { pathname } = request.nextUrl;

      if (!RouteChecker.isAuthRoute(pathname)) {
        return null;
      }

      logger.info("Checking auth route access", { pathname });

      const customerToken = request.cookies.get("customer-token")?.value;

      if (!customerToken) {
        return null; // No token, allow access to auth routes
      }

      // Validate existing token
      const validation = await AuthValidator.validateToken(customerToken);

      if (validation?.isValid) {
        logger.info("Valid token found, redirecting to profile");
        return NextResponse.redirect(new URL("/profile", request.url));
      } else {
        // Invalid token, clear it and allow access to auth routes
        logger.info("Invalid token found, clearing and allowing auth access");
        const response = NextResponse.next();
        response.cookies.delete("customer-token");
        return response;
      }
    } catch (error) {
      logger.error("Auth route handler error", error);
      return null; // Continue to auth route on error
    }
  }
}

// Main middleware function
export async function middleware(request: NextRequest) {
  const startTime = Date.now();
  const { pathname } = request.nextUrl;

  logger.info("Middleware execution started", { pathname });

  try {
    // Handle protected routes first (highest priority) - used to check if user is authenticated
    // if response is null, means token is available and if we get response, means token is not available or expired, so have to redirect to login aka protectedResponse
    const protectedResponse = await MiddlewareHandlers.handleProtectedRoute(
      request
    );
    if (protectedResponse) {
      logger.info("Protected route handler response", {
        pathname,
        duration: Date.now() - startTime,
      });
      return protectedResponse;
    }

    // Handle auth routes
    const authResponse = await MiddlewareHandlers.handleAuthRoute(request);
    if (authResponse) {
      logger.info("Auth route handler response", {
        pathname,
        duration: Date.now() - startTime,
      });
      return authResponse;
    }

    // Handle theme logic (lowest priority) - used to set the theme cookie if it's not already set from any route user is coming from
    const themeResponse = await MiddlewareHandlers.handleThemeLogic(request);
    if (themeResponse) {
      logger.info("Theme handler response", {
        pathname,
        duration: Date.now() - startTime,
      });
      return themeResponse;
    }

    // Default pass-through
    logger.info("Middleware execution completed", {
      pathname,
      duration: Date.now() - startTime,
    });
    return NextResponse.next();
  } catch (error) {
    logger.error("Unexpected middleware error", { pathname, error });

    // Graceful degradation - always allow the request to continue
    // but log the error for monitoring
    return NextResponse.next();
  }
}

// Enhanced matcher configuration
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
