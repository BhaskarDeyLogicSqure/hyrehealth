"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { clearAuth } from "@/store/actions/authAction";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, LogOut, User, Settings } from "lucide-react";
import { useCookies } from "@/hooks/useCookies";

const Topbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { removeCookie } = useCookies();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.authReducer
  );

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

  const handleProfile = () => {
    router.push("/profile");
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  // Don't show navigation on auth pages
  if (pathname.startsWith("/auth/")) {
    return null;
  }

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
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 navbar-nav-text"
                  >
                    <span className="text-sm font-medium">My Account</span>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="navbar-logo-bg text-white text-xs">
                        {user?.firstName
                          ? user.firstName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : user?.isAdmin
                          ? "AU"
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 navbar-dropdown-bg"
                >
                  <DropdownMenuLabel className="navbar-dropdown-text">
                    {user?.firstName} {user?.lastName}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="navbar-border" />
                  <DropdownMenuItem
                    onClick={handleProfile}
                    className="cursor-pointer navbar-dropdown-text navbar-dropdown-hover"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleSettings}
                    className="cursor-pointer navbar-dropdown-text navbar-dropdown-hover"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="navbar-border" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
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
                    <div className="flex items-center space-x-3 py-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="navbar-logo-bg text-white text-xs">
                          {user?.firstName
                            ? user.firstName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                            : user?.isAdmin
                            ? "AU"
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium navbar-dropdown-text">
                        {user?.firstName} {user?.lastName}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleProfile();
                        setIsMobileMenuOpen(false);
                      }}
                      className="justify-start navbar-nav-text navbar-dropdown-hover"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleSettings();
                        setIsMobileMenuOpen(false);
                      }}
                      className="justify-start navbar-nav-text navbar-dropdown-hover"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="justify-start text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
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
