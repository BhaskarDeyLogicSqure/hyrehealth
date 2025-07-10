"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
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
import { Loader2, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useAuthApi } from "@/api/auth/useAuthApi";
import type { RootState } from "@/store";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useSelector(
    (state: RootState) => state.authReducer
  );
  const { login, isLoading, error: loginError } = useAuthApi();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/gift-boxes");
    }
  }, [isAuthenticated, router]);

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      login({ email, password });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen theme-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg theme-bg theme-border border">
        <CardHeader className="space-y-1 text-center">
          <div className="w-16 h-16 theme-bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 theme-text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold theme-text-primary">
            Welcome Back
          </CardTitle>
          <CardDescription className="theme-text-muted">
            Sign in to your Hyre Health account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Demo Credentials */}
            <div className="theme-bg-secondary p-3 rounded-lg text-sm">
              <p className="font-medium theme-text-primary mb-1">
                Demo Credentials:
              </p>
              <p className="theme-text-muted">Email: admin@linden.com</p>
              <p className="theme-text-muted">Password: password</p>
            </div>

            {/* Global Error */}
            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-700 text-sm">{loginError.message}</p>
              </div>
            )}

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
                    if (validationErrors.email) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        email: undefined,
                      }));
                    }
                  }}
                  className={`pl-10 theme-bg theme-border ${
                    validationErrors.email ? "border-red-500" : ""
                  }`}
                  disabled={isLoading}
                />
              </div>
              {validationErrors.email && (
                <p className="text-red-600 text-sm">{validationErrors.email}</p>
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
                    if (validationErrors.password) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        password: undefined,
                      }));
                    }
                  }}
                  className={`pl-10 pr-10 theme-bg theme-border ${
                    validationErrors.password ? "border-red-500" : ""
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 theme-text-muted hover:theme-text-primary"
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
                <p className="text-red-600 text-sm">
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full theme-bg-primary hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm theme-text-muted">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="theme-text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
            <Link
              href="/"
              className="text-sm theme-text-primary hover:underline"
            >
              ← Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
