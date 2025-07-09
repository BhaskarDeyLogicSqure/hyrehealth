import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import ToasterWrapper from "@/components/ui/ToasterWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hyre Health Customer",
  description:
    "Streamlined, intelligent platform for Hyre Health customers to buy and manage their health products.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProviders>
          <ConditionalLayout>{children}</ConditionalLayout>
          <ToasterWrapper />
        </AppProviders>
      </body>
    </html>
  );
}
