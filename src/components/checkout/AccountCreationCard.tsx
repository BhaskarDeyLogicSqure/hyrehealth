import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import RenderFormError from "../RenderFormError";

const AccountCreationCard = ({
  formFields,
  errors,
  handleOnChange,
}: {
  formFields: any;
  errors: any;
  handleOnChange: (field: string, value: string) => void;
}) => {
  const [showHidePassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Your Account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          An account will be created to manage your orders and subscriptions
        </p>

        <div>
          <Label htmlFor="password">
            Password <span className="text-red-600">*</span>
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showHidePassword?.password ? "text" : "password"}
              value={formFields?.password}
              onChange={(e) => handleOnChange("password", e.target.value)}
              required
              className={errors?.password ? "border-red-500 pr-10" : "pr-10"}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() =>
                setShowPassword({
                  ...showHidePassword,
                  password: !showHidePassword?.password,
                })
              }
              aria-label={
                showHidePassword?.password ? "Hide password" : "Show password"
              }
            >
              {showHidePassword?.password ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.062-4.675A9.956 9.956 0 0122 9c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.675-.938M3 3l18 18"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"
                  />
                </svg>
              )}
            </button>
          </div>
          <RenderFormError errors={errors} field="password" />
        </div>

        <div>
          <Label htmlFor="confirmPassword">
            Confirm Password <span className="text-red-600">*</span>
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showHidePassword?.confirmPassword ? "text" : "password"}
              value={formFields?.confirmPassword}
              onChange={(e) =>
                handleOnChange("confirmPassword", e.target.value)
              }
              required
              className={
                errors?.confirmPassword ? "border-red-500 pr-10" : "pr-10"
              }
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
              onClick={() =>
                setShowPassword({
                  ...showHidePassword,
                  confirmPassword: !showHidePassword?.confirmPassword,
                })
              }
              aria-label={
                showHidePassword?.confirmPassword
                  ? "Hide password"
                  : "Show password"
              }
              tabIndex={-1}
            >
              {showHidePassword?.confirmPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.062-4.675A9.956 9.956 0 0122 9c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.675-.938M3 3l18 18"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"
                  />
                </svg>
              )}
            </button>
          </div>
          <RenderFormError errors={errors} field="confirmPassword" />
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountCreationCard;
