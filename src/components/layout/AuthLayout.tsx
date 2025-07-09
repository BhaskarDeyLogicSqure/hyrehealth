"use client";

import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useEffect } from "react";
import { useTheme } from "@/api/theme/useTheme";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { themeData, applyTheme } = useTheme();

  useEffect(() => {
    if (pathname === "/") {
      router.push("/home");
    }
  }, [pathname]);

  useEffect(() => {
    if (themeData) {
      console.log("themeData >>", themeData);
      // applyTheme();
    }
  }, [themeData]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar - always visible for authenticated users */}
      <Topbar />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - only show if not a navbar-only route */}
        <Sidebar />
        {/* Main Content */}
        <main
          className={`flex-1 overflow-auto transition-all duration-300 ${"ml-0"}`}
        >
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
