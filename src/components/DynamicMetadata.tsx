"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { APP_NAME, APP_DESCRIPTION } from "@/configs";

/**
 * DynamicMetadata updates the document title and meta description
 * based on merchant branding data
 */
export const DynamicMetadata = () => {
  const { merchantData } = useSelector(
    (state: RootState) => state?.merchantReducer
  );

  useEffect(() => {
    if (typeof document !== "undefined") {
      const branding = merchantData?.customizeBranding;
      const root = document.documentElement;

      // Update document title
      const title =
        branding?.platformDisplayName || APP_NAME || "Health Portal";
      document.title = title;

      // Update meta description
      const description =
        branding?.platformTagline ||
        APP_DESCRIPTION ||
        "Streamlined, intelligent platform for health customers to buy and manage their health products.";

      // Update or create meta description tag
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", description);
      } else {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        metaDescription.setAttribute("content", description);
        document.head.appendChild(metaDescription);
      }

      // Update favicon if business logo is available
      if (branding?.businessLogo?.url) {
        let favicon = document.querySelector(
          'link[rel="icon"]'
        ) as HTMLLinkElement;
        if (favicon) {
          favicon.href = branding?.businessLogo?.url;
        } else {
          favicon = document.createElement("link");
          favicon.rel = "icon";
          favicon.href = branding?.businessLogo?.url;
          document.head.appendChild(favicon);
        }
      }

      // Apply font family globally if available
      if (branding?.fontFamily) {
        // Apply to CSS variables
        root.style.setProperty("--font-family", branding?.fontFamily);
        root.style.setProperty("--font-sans", branding?.fontFamily);
        root.style.setProperty("--font-family-base", branding?.fontFamily);

        // Apply to body element and all text elements
        document.body.style.fontFamily = `${branding?.fontFamily}, ui-sans-serif, system-ui, sans-serif`;

        // Apply to all text elements through CSS
        const style = document.createElement("style");
        style.textContent = `
          * {
            font-family: ${branding?.fontFamily}, ui-sans-serif, system-ui, sans-serif !important;
          }
          body {
            font-family: ${branding?.fontFamily}, ui-sans-serif, system-ui, sans-serif !important;
          }
          h1, h2, h3, h4, h5, h6, p, span, div, a, button, input, textarea, select, label {
            font-family: ${branding?.fontFamily}, ui-sans-serif, system-ui, sans-serif !important;
          }
        `;

        // Remove existing font style if any
        const existingStyle = document.getElementById("dynamic-font-style");
        if (existingStyle) {
          existingStyle.remove();
        }

        style.id = "dynamic-font-style";
        document.head.appendChild(style);

        // Load Google Fonts if it's a Google Font
        if (
          branding.fontFamily &&
          !branding.fontFamily.includes('"') &&
          !branding.fontFamily.includes("'")
        ) {
          const fontName = branding.fontFamily.replace(/\s+/g, "+");
          const existingFontLink = document.querySelector(
            `link[href*="${fontName}"]`
          );

          if (!existingFontLink) {
            const fontLink = document.createElement("link");
            fontLink.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@300;400;500;600;700&display=swap`;
            fontLink.rel = "stylesheet";
            document.head.appendChild(fontLink);
          }
        }
      }
    }
  }, [merchantData]);

  return null; // This component doesn't render anything
};

export default DynamicMetadata;
