import { redirect } from "next/navigation";
import { headers } from "next/headers";

export interface ErrorHandlerOptions {
  showToast?: boolean;
  redirectTo?: string;
  redirectToPrevious?: boolean;
  logError?: boolean;
  customMessage?: string;
}

export interface ServerError {
  message: string;
  code?: string | number;
  statusCode?: number;
  redirectTo?: string;
  showToast?: boolean;
}

export class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;

  private constructor() {}

  public static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  /**
   * Handles errors in server components
   * @param error - The error object
   * @param options - Error handling options
   */
  public handleServerError(
    error: any,
    options: ErrorHandlerOptions = {}
  ): never {
    const {
      showToast = true,
      redirectTo,
      redirectToPrevious = false,
      logError = true,
      customMessage,
    } = options;

    // Log error for debugging
    if (logError) {
      console.error("Server Error Handler:", {
        message: error?.message || "Unknown error",
        stack: error?.stack,
        timestamp: new Date().toISOString(),
        url: this.getCurrentUrl(),
        options,
      });
    }

    // Determine error message
    const errorMessage = customMessage || this.getErrorMessage(error);

    // Determine redirect URL
    let redirectUrl = "/";

    if (redirectTo) {
      redirectUrl = redirectTo;
    } else if (redirectToPrevious) {
      redirectUrl = this.getPreviousUrl() || "/";
    } else {
      // Default redirects based on error type
      redirectUrl = this.getDefaultRedirectUrl(error);
    }

    // Create error query params for client-side toast
    const errorParams = new URLSearchParams();
    if (showToast) {
      const errorType = this.getErrorType(error);
      errorParams.set("error", errorMessage);
      errorParams.set("error_type", errorType);
    }

    const finalUrl = errorParams?.toString()
      ? `${redirectUrl}?${errorParams?.toString()}`
      : redirectUrl;

    // Redirect with error information
    redirect(finalUrl);
  }

  /**
   * Creates a standardized error response for API routes
   */
  public createErrorResponse(error: any, statusCode: number = 500): Response {
    const errorMessage = this.getErrorMessage(error);

    return new Response(
      JSON.stringify({
        error: true,
        message: errorMessage,
        code: error?.code || "UNKNOWN_ERROR",
        timestamp: new Date().toISOString(),
      }),
      {
        status: statusCode,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  /**
   * Extracts meaningful error message from error object
   */
  private getErrorMessage(error: any): string {
    if (typeof error === "string") return error;
    if (error?.message) return error.message;
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.response?.statusText) return error.response.statusText;
    return "An unexpected error occurred";
  }

  /**
   * Determines error type for better categorization
   */
  private getErrorType(error: any): string {
    if (error?.code === "ENOTFOUND" || error?.message?.includes("network")) {
      return "network";
    }
    if (error?.response?.status === 404) {
      return "not_found";
    }
    if (error?.response?.status === 401) {
      return "unauthorized";
    }
    if (error?.response?.status === 403) {
      return "forbidden";
    }
    if (error?.response?.status >= 500) {
      return "server";
    }
    return "client";
  }

  /**
   * Gets default redirect URL based on error type
   */
  private getDefaultRedirectUrl(error: any): string {
    const errorType = this.getErrorType(error);

    switch (errorType) {
      case "unauthorized":
        return "/auth/login";
      case "not_found":
        return "/404";
      case "forbidden":
        return "/403";
      default:
        return "/";
    }
  }

  /**
   * Gets current URL from headers
   */
  private getCurrentUrl(): string {
    try {
      const headersList = headers();
      const url = headersList.get("x-url") || headersList.get("referer") || "";
      return url;
    } catch {
      return "";
    }
  }

  /**
   * Gets previous URL from referrer
   */
  private getPreviousUrl(): string | null {
    try {
      const headersList = headers();
      const referer = headersList.get("referer");
      if (referer) {
        const url = new URL(referer);
        return url.pathname;
      }
      return null;
    } catch {
      return null;
    }
  }
}

// Export singleton instance
export const errorHandler = GlobalErrorHandler.getInstance();

// Convenience functions
export function handleServerError(
  error: any,
  options?: ErrorHandlerOptions
): never {
  return errorHandler.handleServerError(error, options);
}

export function createErrorResponse(error: any, statusCode?: number): Response {
  return errorHandler.createErrorResponse(error, statusCode);
}
