"use client";

import { useSelector } from "react-redux";
import AuthLayout from "./AuthLayout";
import PublicLayout from "./PublicLayout";
import { RootState } from "@/store";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const { isAuthenticated } = useSelector(
    (state: RootState) => state.authReducer
  );

  console.log("isAuthenticated", isAuthenticated);

  // For logged-in users: Always use AuthLayout (navbar + sidebar)
  if (isAuthenticated) {
    return <AuthLayout>{children}</AuthLayout>;
  }

  // For guest users: Always use PublicLayout
  if (!isAuthenticated) {
    return <PublicLayout>{children}</PublicLayout>;
  }

  // Default fallback: redirect to login
  return <>{children}</>;
}
