"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import HyreHealthCustomerLogo from "@/components/HyreHealthCustomerLogo";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (path: string) => {
    router.push(path);
  };

  const NAVBAR_ONLY_ROUTES = "/";

  const isNavbarOnlyRoute = NAVBAR_ONLY_ROUTES === pathname;

  console.log("public layout");

  return (
    <>
      {isNavbarOnlyRoute ? (
        <>{children}</>
      ) : (
        <div className="min-h-screen bg-gray-50">
          {/* Simple Navbar for unauthenticated users */}
          <header className="border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4">
              <nav className="flex items-center justify-between">
                <div
                  className="cursor-pointer"
                  onClick={() => handleClick("/")}
                >
                  <HyreHealthCustomerLogo size="medium" />
                </div>

                <div className="flex items-center space-x-4">
                  {pathname !== "/auth/login" && (
                    <Button
                      onClick={() => handleClick("/auth/login")}
                      className="bg-linden-blue hover:bg-linden-blue/90"
                    >
                      Sign In
                    </Button>
                  )}
                </div>
              </nav>
            </div>
          </header>

          {/* Main Conten */}
          <main className="container mx-auto flex-1 top-0 py-10">
            {children}
          </main>
        </div>
      )}
    </>
  );
}
