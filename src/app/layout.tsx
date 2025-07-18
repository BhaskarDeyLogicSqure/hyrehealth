import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/themes.css";
import { AppProviders } from "@/components/providers/AppProviders";
import ToasterWrapper from "@/components/ui/ToasterWrapper";
import GlobalErrorHandler from "@/components/GlobalErrorHandler";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { DEFAULT_THEME } from "@/lib/theme-utils";
import Layout from "@/components/layout/Layout";
import Topbar from "@/components/layout/Topbar";
import { cookies } from "next/headers";
import { Theme } from "@/types/theme";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hyre Health Customer",
  description:
    "Streamlined, intelligent platform for Hyre Health customers to buy and manage their health products.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get theme from API server-side
  const cookieStore = cookies();
  let theme = (cookieStore.get("theme")?.value as Theme) || DEFAULT_THEME;

  return (
    <html lang="en" data-theme={theme}>
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <AppProviders>
            <Topbar />
            <Layout>{children}</Layout>
            <ToasterWrapper />
            <Suspense fallback={null}>
              <GlobalErrorHandler />
            </Suspense>
          </AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
