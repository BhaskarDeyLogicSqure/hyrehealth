"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  Eye,
  EyeOff,
  Lock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    token?: string;
  }>({});

  useEffect(() => {
    // Get token from URL params
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      console.log("No token found");
      // set validation error
      // setValidationErrors({ token: "Invalid or missing reset token" });
    }
  }, [searchParams]);

  const validateForm = () => {
    const errors: {
      password?: string;
      confirmPassword?: string;
      token?: string;
    } = {};

    if (!token) {
      errors.token = "Reset token is required";
    }

    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    if (!confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call for demo
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real app, you would make an API call here
      // await resetPasswordApi({ token, password });

      setIsSubmitted(true);
    } catch (error) {
      setError(
        "Failed to reset password. Please try again or request a new reset link."
      );
      console.error("Reset password failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (isSubmitted) {
    return (
      <div className="min-h-screen theme-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg theme-bg theme-border border">
          <CardHeader className="space-y-1 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold theme-text-primary">
              Password Reset Successful
            </CardTitle>
            <CardDescription className="theme-text-muted">
              Your password has been successfully updated
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="theme-bg-muted p-4 rounded-lg text-center">
              <p className="text-sm theme-text-primary">
                You can now sign in with your new password
              </p>
            </div>

            <Button
              onClick={() => router.push("/auth/login")}
              className="w-full theme-bg-primary text-white hover:opacity-90 transition-opacity"
            >
              Sign In Now
            </Button>

            {/* Footer Links */}
            <div className="pt-4 border-t theme-border text-center space-y-2">
              <Link
                href="/"
                className="text-sm theme-text-primary hover:underline transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Invalid token state
  if (validationErrors.token) {
    return (
      <div className="min-h-screen theme-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg theme-bg theme-border border">
          <CardHeader className="space-y-1 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold theme-text-primary">
              Invalid Reset Link
            </CardTitle>
            <CardDescription className="theme-text-muted">
              This password reset link is invalid or has expired
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="theme-bg-muted p-4 rounded-lg text-center">
              <p className="text-sm theme-text-primary mb-2">
                Password reset links expire after 24 hours for security reasons.
              </p>
              <p className="text-sm theme-text-muted">
                Please request a new password reset link to continue.
              </p>
            </div>

            <Button
              onClick={() => router.push("/auth/forgot-password")}
              className="w-full theme-bg-primary text-white hover:opacity-90 transition-opacity"
            >
              Request New Reset Link
            </Button>

            {/* Footer Links */}
            <div className="pt-4 border-t theme-border text-center space-y-2">
              <Link
                href="/"
                className="text-sm theme-text-primary hover:underline transition-colors"
              >
                ← Back to Home
              </Link>
              <div className="text-sm theme-text-muted">
                Remember your password?{" "}
                <Link
                  href="/auth/login"
                  className="theme-text-primary hover:underline font-medium"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Form state
  return (
    <div className="min-h-screen theme-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg theme-bg theme-border border">
        <CardHeader className="space-y-1 text-center">
          <div className="w-16 h-16 theme-bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold theme-text-primary">
            Reset Your Password
          </CardTitle>
          <CardDescription className="theme-text-muted">
            Enter your new password below
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Global Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 dark:bg-red-900/20 dark:border-red-800">
                <p className="text-red-700 dark:text-red-400 text-sm">
                  {error}
                </p>
              </div>
            )}

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="theme-text-primary font-medium"
              >
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 theme-text-muted" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors.password) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        password: undefined,
                      }));
                    }
                  }}
                  className={`pl-10 pr-10 theme-bg theme-border theme-text-primary placeholder:theme-text-muted ${
                    validationErrors.password
                      ? "border-red-500 dark:border-red-400"
                      : ""
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 theme-text-muted hover:theme-text-primary transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="theme-text-primary font-medium"
              >
                Confirm New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 theme-text-muted" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (validationErrors.confirmPassword) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        confirmPassword: undefined,
                      }));
                    }
                  }}
                  className={`pl-10 pr-10 theme-bg theme-border theme-text-primary placeholder:theme-text-muted ${
                    validationErrors.confirmPassword
                      ? "border-red-500 dark:border-red-400"
                      : ""
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 theme-text-muted hover:theme-text-primary transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="theme-bg-muted p-3 rounded-lg text-sm">
              <p className="font-medium theme-text-primary mb-1">
                Password Requirements:
              </p>
              <ul className="theme-text-muted space-y-1 text-xs">
                <li>• At least 8 characters long</li>
                <li>• Contains uppercase and lowercase letters</li>
                <li>• Contains at least one number</li>
              </ul>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full theme-bg-primary text-white hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <Link
              href="/"
              className="text-sm theme-text-primary hover:underline transition-colors"
            >
              ← Back to Home
            </Link>
            <div className="text-sm theme-text-muted">
              Remember your password?{" "}
              <Link
                href="/auth/login"
                className="theme-text-primary hover:underline font-medium"
              >
                Sign In
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
