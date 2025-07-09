"use client";

import React from "react";
import { useRouter } from "next/navigation";
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
import { LogOut, User } from "lucide-react";
import { useCookies } from "@/hooks/useCookies";
import { useThemeContext } from "@/contexts/ThemeContext";

const Topbar: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { removeCookie } = useCookies();
  const { user } = useSelector((state: RootState) => state.authReducer);
  const { primaryColor, secondaryColor } = useThemeContext();

  const handleLogout = () => {
    dispatch(clearAuth());
    removeCookie("token");
    router.push("/auth/login");
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  return (
    <div className="h-16 border-b border-gray-200 px-4 flex items-center justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-black hover:text-black/80"
          >
            <span className="hidden sm:inline-block text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </span>
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback
                style={{ backgroundColor: primaryColor }}
                className="bg-primary text-white"
              >
                {user?.firstName
                  ? user.firstName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : user?.isAdmin
                  ? "AU"
                  : "CN"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleProfile}
            className="cursor-pointer focus:text-brand-dark-blue/100 text-brand-dark-blue/100 hover:bg-brand-light-blue/100"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer focus:text-red-500 text-red-500 hover:bg-red-500/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Topbar;
