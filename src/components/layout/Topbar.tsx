"use client";

import React, { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { clearAuth } from "@/store/actions/authAction";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  LogOut,
  User,
  Package,
  History,
  CreditCard,
} from "lucide-react";
import { useCookies } from "@/hooks/useCookies";
import { isUserAuthenticated } from "@/utils/auth";
import Swal from "sweetalert2";
import NavigationLoader from "./NavigationLoader";
import Image from "next/image";
import { APP_NAME } from "@/configs";

const Topbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { removeCookie } = useCookies();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user } = useSelector((state: RootState) => state?.authReducer);
  const { merchantData } = useSelector(
    (state: RootState) => state?.merchantReducer
  );

  // Navigation items for the main menu
  const navigationItems = useMemo(
    () => [
      { name: "Treatments", href: "/categories" },
      { name: "All Products", href: "/products" },
      { name: "How It Works", href: "/how-it-works" },
      { name: "Support", href: "/support" },
    ],
    []
  );

  const _handleLogoutAlert = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result?.isConfirmed) {
        _handleLogout();
      }
    });
  };

  const _handleLogout = () => {
    dispatch(clearAuth());
    removeCookie("customer-token");

    // If user is on profile page, redirect to homepage
    if (pathname.startsWith("/profile")) {
      router.push("/");
    } else {
      // For other pages, redirect to current page to refresh the state
      router.push(pathname);
    }
  };

  const _handleRoute = (path: string) => {
    router.push(path);
  };

  // Check if user is authenticated from the cookie
  const isAuthenticated = isUserAuthenticated();

  return (
    <>
      <NavigationLoader />
      <nav className="navbar-bg navbar-border border-b sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="container px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-3 group">
                {merchantData?.customizeBranding?.businessLogo?.url ? (
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center border bg-muted">
                    <Image
                      src={merchantData?.customizeBranding?.businessLogo?.url}
                      alt={
                        merchantData?.customizeBranding?.platformDisplayName ||
                        "Logo"
                      }
                      width={40}
                      height={40}
                      className="object-contain w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 navbar-logo-bg rounded-lg flex items-center justify-center border bg-primary">
                    <span className="text-white font-bold text-xl">
                      {merchantData?.customizeBranding
                        ?.platformDisplayName?.[0] || "H"}
                    </span>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-xl font-bold navbar-logo-text leading-tight">
                    {merchantData?.customizeBranding?.platformDisplayName ||
                      APP_NAME}
                  </span>
                  {merchantData?.customizeBranding?.platformTagline && (
                    <span className="text-xs text-muted-foreground font-normal leading-tight">
                      {merchantData?.customizeBranding?.platformTagline}
                    </span>
                  )}
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.href}
                  href={item?.href}
                  className={`
                  px-3 py-2 text-md font-medium transition-colors navbar-nav-text
                  ${pathname === item?.href ? "navbar-nav-text-active" : ""}
                `}
                >
                  {item?.name}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => _handleRoute("/profile?tab=subscriptions")} // Navigate to profile page with subscriptions tab
                    className="text-sm"
                    style={{
                      color: merchantData?.customizeBranding?.accentColor,
                    }}
                  >
                    <User className="h-4 w-4 mr-2" />
                    My Account
                  </Button>

                  <Button
                    onClick={_handleLogoutAlert}
                    variant="outline"
                    size="sm"
                    className="text-red-600 text-sm cursor-pointer hover:text-white hover:bg-red-600"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                // Unauthenticated Sign In Button
                <Button
                  onClick={() => _handleRoute("/auth/login")}
                  variant="outline"
                  size="sm"
                  className="navbar-nav-text text-sm"
                  style={{
                    color: merchantData?.customizeBranding?.accentColor,
                  }}
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="navbar-nav-text"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-4 border-t navbar-border">
              <div className="flex flex-col space-y-4">
                {/* Mobile Navigation Items */}
                {navigationItems?.map((item) => (
                  <Link
                    key={item?.href}
                    href={item?.href}
                    className={`
                    text-sm font-medium transition-colors py-2 navbar-nav-text
                    ${pathname === item?.href ? "navbar-nav-text-active" : ""}
                  `}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item?.name}
                  </Link>
                ))}

                {/* Mobile Authentication Actions */}
                <div className="pt-4 border-t navbar-border">
                  {isAuthenticated ? (
                    <div className="flex flex-col space-y-2">
                      <div className="text-sm font-medium text-gray-900 px-2 py-1">
                        Welcome, {user?.firstName || user?.fullName}
                      </div>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          _handleRoute("/profile?tab=subscriptions");
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <Package className="h-4 w-4 mr-2" />
                        My Subscriptions
                        {/* <Badge variant="secondary" className="ml-auto">
                        2
                      </Badge> */}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          _handleRoute("/profile?tab=orders");
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <History className="h-4 w-4 mr-2" />
                        Order History
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          _handleRoute("/profile?tab=payments");
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Payment Methods
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-red-600"
                        onClick={() => {
                          _handleLogoutAlert();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        _handleRoute("/auth/login");
                        setIsMobileMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full justify-start navbar-nav-text"
                      style={{
                        color: merchantData?.customizeBranding?.accentColor,
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Topbar;
