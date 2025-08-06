"use client";

import { useState } from "react";
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
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useAuthApi } from "@/api/auth/useAuthApi";
import ThemeLoader from "@/components/ThemeLoader";

export default function LoginPage() {
  const { login, isLoading } = useAuthApi();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const _validateForm = () => {
    const errors: { email?: string; password?: string } = {};

    if (!email?.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password?.trim()) {
      errors.password = "Password is required";
    } else if (password?.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const _handleSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!_validateForm()) {
      return;
    }

    try {
      await login({ handle: email, password });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen theme-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg theme-bg theme-border border">
        <CardHeader className="space-y-1 text-center">
          <div className="w-16 h-16 theme-bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold theme-text-primary">
            Welcome Back
          </CardTitle>
          <CardDescription className="theme-text-muted">
            Sign in to your Hyre Health account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={_handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="theme-text-primary font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 theme-text-muted" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationErrors?.email) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        email: undefined,
                      }));
                    }
                  }}
                  className={`pl-10 theme-bg theme-border theme-text-primary placeholder:theme-text-muted ${
                    validationErrors?.email
                      ? "border-red-500 dark:border-red-400"
                      : ""
                  }`}
                  disabled={isLoading}
                />
              </div>
              {validationErrors?.email && (
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {validationErrors?.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="theme-text-primary font-medium"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 theme-text-muted" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors?.password) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        password: undefined,
                      }));
                    }
                  }}
                  className={`pl-10 pr-10 theme-bg theme-border theme-text-primary placeholder:theme-text-muted ${
                    validationErrors?.password
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
              {validationErrors?.password && (
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {validationErrors?.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full theme-bg-primary text-white hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ThemeLoader
                    type="inline"
                    variant="simple"
                    size="sm"
                    message="Signing In..."
                    className="mr-2"
                  />
                </>
              ) : (
                "Sign In"
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
              Forgot your password?{" "}
              <Link
                href="/auth/forgot-password"
                className="theme-text-primary hover:underline font-medium"
              >
                Reset it here
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
