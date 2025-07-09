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
    <div className="flex items-center justify-center ">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="w-16 h-16 bg-brand-dark-blue rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-brand-charcoal">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-brand-dark-charcoal">
            Sign in to your Hyre Health account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Demo Credentials */}
            <div className="bg-brand-light-blue/30 p-3 rounded-lg text-sm">
              <p className="font-medium text-brand-dark-blue mb-1">
                Demo Credentials:
              </p>
              <p className="text-brand-dark-charcoal">
                Email: admin@linden.com
              </p>
              <p className="text-brand-dark-charcoal">Password: password</p>
            </div>

            {/* Global Error */}
            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-700 text-sm">{loginError.message}</p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-brand-charcoal font-medium"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                  className={`pl-10 ${
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
                className="text-brand-charcoal font-medium"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                  className={`pl-10 pr-10 ${
                    validationErrors.password ? "border-red-500" : ""
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
              className="w-full bg-brand-dark-blue/100 hover:bg-brand-dark-blue/90 text-white"
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
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-brand-dark-blue hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
            <Link
              href="/"
              className="text-sm text-brand-dark-blue hover:underline"
            >
              ← Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
