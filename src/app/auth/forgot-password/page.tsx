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
import { Loader2, Mail, KeyRound, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");

  const validateForm = () => {
    if (!email.trim()) {
      setValidationError("Email is required");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError("Please enter a valid email address");
      return false;
    }

    setValidationError("");
    return true;
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
      // await forgotPasswordApi({ email });

      setIsSubmitted(true);
    } catch (error) {
      setError("An error occurred. Please try again later.");
      console.error("Forgot password failed:", error);
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
              Check Your Email
            </CardTitle>
            <CardDescription className="theme-text-muted">
              We've sent a password reset link to your email
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="theme-bg-muted p-4 rounded-lg text-center">
              <p className="text-sm theme-text-primary mb-2">
                We've sent a password reset link to:
              </p>
              <p className="font-medium theme-text-primary break-all">
                {email}
              </p>
            </div>

            <div className="text-sm theme-text-muted text-center space-y-2">
              <p>
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                }}
                className="theme-text-primary hover:underline font-medium"
              >
                Try again with a different email
              </button>
            </div>

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

  // Form state
  return (
    <div className="min-h-screen theme-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg theme-bg theme-border border">
        <CardHeader className="space-y-1 text-center">
          <div className="w-16 h-16 theme-bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold theme-text-primary">
            Forgot Password
          </CardTitle>
          <CardDescription className="theme-text-muted">
            Enter your email address and we'll send you a link to reset your
            password
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
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationError) {
                      setValidationError("");
                    }
                  }}
                  className={`pl-10 theme-bg theme-border theme-text-primary placeholder:theme-text-muted ${
                    validationError ? "border-red-500 dark:border-red-400" : ""
                  }`}
                  disabled={isLoading}
                />
              </div>
              {validationError && (
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {validationError}
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Reset Link...
                </>
              ) : (
                "Send Reset Link"
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
                className="theme-text-primary hover:underline font-medium "
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
