import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/themes.css";
import { AppProviders } from "@/components/providers/AppProviders";
import ToasterWrapper from "@/components/ui/ToasterWrapper";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { DEFAULT_THEME } from "@/lib/theme-utils";
import Layout from "@/components/layout/Layout";
import Topbar from "@/components/layout/Topbar";
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
  let theme = DEFAULT_THEME;

  // TODO: Uncomment this when we have a way to fetch the theme from the API server
  // try {
  //   const headersList = headers();
  //   const requestHeaders: Record<string, string> = {};

  //   // Forward important headers for authentication
  //   const authHeader = headersList.get("authorization");
  //   if (authHeader) {
  //     requestHeaders["authorization"] = authHeader;
  //   }

  //   const cookieHeader = headersList.get("cookie");
  //   if (cookieHeader) {
  //     requestHeaders["cookie"] = cookieHeader;
  //   }

  //   theme = await fetchThemeFromAPIServer(requestHeaders);
  // } catch (error) {
  //   console.warn("Failed to fetch theme server-side, using default:", error);
  // }

  return (
    <html lang="en" data-theme={theme}>
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <AppProviders>
            <Topbar />
            <Layout>{children}</Layout>
            <ToasterWrapper />
          </AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
