"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { clearAuth } from "@/store/actions/authAction";
import { useCookies } from "@/hooks/useCookies";
import { isUserAuthenticated } from "@/utils/auth";
import Swal from "sweetalert2";
import NavigationLoader from "./NavigationLoader";
import { testTheme } from "@/configs";
import { MerchantNMIpaymentTokenResponse } from "@/types/auth";
import DefaultTopbar from "@/themes/default/layout/DefaultTopbar";
import ClassicTopbar from "@/themes/classic/layout/ClassicTopbar";
import { UserDataType } from "@/types";

const DefaultTopbarComponent = ({
  merchantData,
  isAuthenticated,
  pathname,
  user,
  handleRoute,
  handleLogoutAlert,
  handleLogout,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: {
  merchantData: MerchantNMIpaymentTokenResponse["data"];
  isAuthenticated: boolean;
  pathname: string;
  user: UserDataType;
  handleRoute: (path: string) => void;
  handleLogoutAlert: () => void;
  handleLogout: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}) => {
  return (
    <DefaultTopbar
      merchantData={merchantData}
      isAuthenticated={isAuthenticated}
      pathname={pathname}
      user={user}
      handleRoute={handleRoute}
      handleLogoutAlert={handleLogoutAlert}
      handleLogout={handleLogout}
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
    />
  );
};

const ClassicTopbarComponent = ({
  merchantData,
  isAuthenticated,
  pathname,
  user,
  handleRoute,
  handleLogoutAlert,
  handleLogout,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: {
  merchantData: MerchantNMIpaymentTokenResponse["data"];
  isAuthenticated: boolean;
  pathname: string;
  user: UserDataType;
  handleRoute: (path: string) => void;
  handleLogoutAlert: () => void;
  handleLogout: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}) => {
  return (
    <ClassicTopbar
      merchantData={merchantData}
      isAuthenticated={isAuthenticated}
      pathname={pathname}
      user={user}
      handleRoute={handleRoute}
      handleLogoutAlert={handleLogoutAlert}
      handleLogout={handleLogout}
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
    />
  );
};

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

  // Get current theme from cookie store
  //  const cookieStore = cookies(); // get the cookie store
  // const theme = (cookieStore.get("theme")?.value as Theme) || DEFAULT_THEME;
  const theme = testTheme;

  const ThemeComponents = {
    default: DefaultTopbarComponent,
    classic: ClassicTopbarComponent,
  };

  const SelectedComponent =
    ThemeComponents[theme as keyof typeof ThemeComponents] ||
    DefaultTopbarComponent;

  return (
    <>
      <NavigationLoader />
      <SelectedComponent
        merchantData={merchantData as MerchantNMIpaymentTokenResponse["data"]}
        isAuthenticated={isAuthenticated}
        pathname={pathname}
        user={user as UserDataType}
        handleRoute={_handleRoute}
        handleLogoutAlert={_handleLogoutAlert}
        handleLogout={_handleLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
    </>
  );
};

export default Topbar;
