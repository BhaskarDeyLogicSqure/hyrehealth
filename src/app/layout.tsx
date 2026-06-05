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
import DynamicMetadata from "@/components/DynamicMetadata";
import { cookies, headers } from "next/headers";
import { Theme } from "@/types/theme";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

const FALLBACK_TITLE = "Health Portal";
const FALLBACK_DESCRIPTION =
  "Streamlined, intelligent platform for health customers to buy and manage their health products.";

const fallbackMetadata: Metadata = {
  title: FALLBACK_TITLE,
  description: FALLBACK_DESCRIPTION,
  openGraph: {
    title: FALLBACK_TITLE,
    description: FALLBACK_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: FALLBACK_TITLE,
    description: FALLBACK_DESCRIPTION,
  },
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) return fallbackMetadata;

    const headersList = headers();
    const host = headersList.get("host") || "";
    const protocol = headersList.get("x-forwarded-proto") || "https";
    const origin =
      headersList.get("origin") ||
      (host ? `${protocol}://${host}` : baseUrl);

    const url = `${baseUrl}/payment/merchant-nmi-key`;
    // console.log({ url, origin })
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Origin: origin,
      },
    });

    // console.log("sauvik ", { response })
    if (!response.ok) return fallbackMetadata;

    const json = await response.json();
    // console.log("goel ", { json })
    const branding = json?.data?.customizeBranding;

    // console.log("goel ", { branding })
    const displayName: string = branding?.platformDisplayName || "";
    const tagline: string = branding?.platformTagline || "";


    // console.log("skg ", { displayName, tagline })
    if (!displayName) return fallbackMetadata;

    const title = tagline ? `${displayName} | ${tagline}` : displayName;
    const description = tagline || displayName;

    return {
      title,
      description,
      openGraph: { title, description },
      twitter: { card: "summary", title, description },
    };
  } catch {
    return fallbackMetadata;
  }
}

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
            <DynamicMetadata />
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
