"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { clearAuth } from "@/store/actions/authAction";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  X,
  LogOut,
  User,
  Package,
  History,
  CreditCard,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCookies } from "@/hooks/useCookies";
import { isUserAuthenticated } from "@/utils/auth";
const Topbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { removeCookie } = useCookies();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, isAuthenticated: isAuthenticatedFromRedux } = useSelector(
    (state: RootState) => state.authReducer
  );

  // Check if user is authenticated from the cookie or the redux store
  const isAuthenticated = isUserAuthenticated() || isAuthenticatedFromRedux;
  console.log({ user, isAuthenticated });

  // Navigation items for the main menu
  const navigationItems = [
    { name: "Treatments", href: "/categories" },
    { name: "All Products", href: "/products" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Support", href: "/support" },
  ];

  const handleLogout = () => {
    dispatch(clearAuth());
    removeCookie("token");
    router.push("/");
  };

  const handleLogin = () => {
    router.push("/auth/login");
  };

  const handleMySubscriptions = () => {
    router.push("/profile?tab=subscriptions"); // Navigate to profile page with subscriptions tab
  };

  const handleOrderHistory = () => {
    router.push("/profile?tab=orders"); // Navigate to profile page with orders tab
  };

  const handlePaymentMethods = () => {
    router.push("/profile?tab=payments"); // Navigate to profile page with payments tab
  };

  // Mock user name for display - in real app this would come from user data
  const userName = user?.firstName || "John";

  // Don't show navigation on auth pages
  // if (pathname.startsWith("/auth/")) {
  //   return null;
  // }

  return (
    <nav className="navbar-bg navbar-border border-b sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 navbar-logo-bg rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="text-xl font-bold navbar-logo-text">
                HealthPortal
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  px-3 py-2 text-sm font-medium transition-colors navbar-nav-text
                  ${pathname === item.href ? "navbar-nav-text-active" : ""}
                `}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              // Authenticated User Dropdown
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    My Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-medium text-gray-900">
                    Welcome, {userName}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleMySubscriptions}
                    className="cursor-pointer"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    My Subscriptions
                    <Badge variant="secondary" className="ml-auto">
                      2
                    </Badge>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleOrderHistory}
                    className="cursor-pointer"
                  >
                    <History className="h-4 w-4 mr-2" />
                    Order History
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handlePaymentMethods}
                    className="cursor-pointer"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Manage Payment Methods
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Unauthenticated Sign In Button
              <Button
                onClick={handleLogin}
                variant="outline"
                size="sm"
                className="navbar-nav-text"
              >
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
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
          <div className="md:hidden py-4 border-t navbar-border">
            <div className="flex flex-col space-y-4">
              {/* Mobile Navigation Items */}
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    text-sm font-medium transition-colors py-2 navbar-nav-text
                    ${pathname === item.href ? "navbar-nav-text-active" : ""}
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Authentication Actions */}
              <div className="pt-4 border-t navbar-border">
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-2">
                    <div className="text-sm font-medium text-gray-900 px-2 py-1">
                      Welcome, {userName}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        handleMySubscriptions();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      My Subscriptions
                      <Badge variant="secondary" className="ml-auto">
                        2
                      </Badge>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        handleOrderHistory();
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
                        handlePaymentMethods();
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
                        handleLogout();
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
                      handleLogin();
                      setIsMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full justify-start navbar-nav-text"
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
  );
};

export default Topbar;
