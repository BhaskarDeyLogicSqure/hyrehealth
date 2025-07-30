import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Lock, Eye, EyeOff } from "lucide-react";
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
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showHidePassword?.password ? "text" : "password"}
              value={formFields?.password}
              onChange={(e) => handleOnChange("password", e.target.value)}
              required
              className={`${
                errors?.password ? "border-red-500" : ""
              } pl-10 pr-10`}
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
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
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
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="confirmPassword"
              type={showHidePassword?.confirmPassword ? "text" : "password"}
              value={formFields?.confirmPassword}
              onChange={(e) =>
                handleOnChange("confirmPassword", e.target.value)
              }
              required
              className={`${
                errors?.confirmPassword ? "border-red-500" : ""
              } pl-10 pr-10`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
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
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
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
