import React from "react";
import { APP_NAME } from "@/configs";
import { formatAddress, getCurrentYear } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { MerchantNMIpaymentTokenResponse } from "@/types/auth";

const DefaultFooter = ({
  merchantData,
}: {
  merchantData: MerchantNMIpaymentTokenResponse["data"];
}) => {
  return (
    <footer className="footer-bg footer-text py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-3">
                {merchantData?.customizeBranding?.businessLogo?.url ? (
                  <div className="rounded-md border bg-muted flex items-center justify-center w-10 h-10">
                    <Image
                      src={merchantData?.customizeBranding?.businessLogo?.url}
                      alt={
                        merchantData?.customizeBranding?.platformDisplayName ||
                        "Logo"
                      }
                      width={40}
                      height={40}
                      className="object-contain w-8 h-8"
                    />
                  </div>
                ) : (
                  <div className="rounded-md border bg-primary flex items-center justify-center w-10 h-10">
                    <span className="text-white font-bold text-lg">
                      {merchantData?.customizeBranding
                        ?.platformDisplayName?.[0] || "H"}
                    </span>
                  </div>
                )}
                <span className="text-xl font-semibold tracking-tight">
                  {merchantData?.customizeBranding?.platformDisplayName ||
                    APP_NAME}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                {merchantData?.customizeBranding?.platformTagline ||
                  "Personalized telehealth treatments delivered to your door."}
              </p>
            </div>
          </div>
          {/* Contact Information */}
          <div>
            <h3 className="font-semibold mb-4 footer-text">
              Contact Information
            </h3>
            <ul className="space-y-2 text-sm">
              {merchantData?.address?.zipCode ||
              merchantData?.merchantAddress?.zipCode ? (
                <li className="flex flex-col items-start gap-2">
                  <Label
                    htmlFor="supportAddress"
                    className="footer-link transition-colors"
                  >
                    Address:
                  </Label>
                  <p
                    id="merchantAddress"
                    className="footer-link transition-colors"
                  >
                    {formatAddress(
                      merchantData?.address || merchantData?.merchantAddress
                    )}
                  </p>
                </li>
              ) : null}

              <li className="flex flex-col items-start gap-2">
                <Label
                  htmlFor="supportPhone"
                  className="footer-link transition-colors"
                >
                  Phone:
                </Label>
                <a
                  id="supportPhone"
                  href={`tel:${merchantData?.supportPhone}`}
                  className="footer-link transition-colors"
                >
                  {merchantData?.supportPhone || "N/A"}
                </a>
              </li>
              <li className="flex flex-col items-start gap-2">
                <Label
                  htmlFor="supportEmail"
                  className="footer-link transition-colors"
                >
                  Email:
                </Label>
                <a
                  id="supportEmail"
                  href={`mailto:${merchantData?.supportEmail}`}
                  className="footer-link transition-colors"
                >
                  {merchantData?.supportEmail || "N/A"}
                </a>
              </li>
            </ul>
          </div>
          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4 footer-text">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/support" className="footer-link transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/support" className="footer-link transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/support" className="footer-link transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 footer-text">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy-policy"
                  className="footer-link transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="footer-link transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/return-policy"
                  className="footer-link transition-colors"
                >
                  Return / Refund Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            {/* Social Media Links */}
            {merchantData?.customizeBranding?.socialMediaLinks &&
              merchantData?.customizeBranding?.socialMediaLinks.length > 0 && (
                <>
                  <h4 className="font-semibold mb-3 footer-text text-sm">
                    Follow Us
                  </h4>
                  <div className="flex space-x-3">
                    {merchantData?.customizeBranding?.socialMediaLinks?.map(
                      (socialLink) => {
                        // Map platform to icon and color
                        let IconComponent;
                        let iconColor = "";
                        switch (socialLink?.platform?.toLowerCase()) {
                          case "facebook":
                            IconComponent = require("lucide-react").Facebook;
                            iconColor = "#1877F3";
                            break;
                          case "twitter":
                            IconComponent = require("lucide-react").Twitter;
                            iconColor = "#1DA1F2";
                            break;
                          case "instagram":
                            IconComponent = require("lucide-react").Instagram;
                            iconColor =
                              "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)";
                            break;
                          case "linkedin":
                            IconComponent = require("lucide-react").Linkedin;
                            iconColor = "#0077B5";
                            break;
                          case "youtube":
                            IconComponent = require("lucide-react").Youtube;
                            iconColor = "#FF0000";
                            break;
                          case "tiktok":
                            IconComponent = require("lucide-react").Tiktok;
                            iconColor = "#010101";
                            break;
                          default:
                            IconComponent = require("lucide-react").Globe;
                            iconColor = "#6B7280"; // neutral gray
                        }

                        return (
                          <Link
                            key={socialLink?.id}
                            href={socialLink?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer-link transition-colors text-muted-foreground hover:text-primary"
                            title={`Follow us on ${socialLink?.platform}`}
                          >
                            <IconComponent
                              className="h-5 w-5"
                              aria-label={socialLink?.platform}
                              // style={iconStyle}
                            />
                          </Link>
                        );
                      }
                    )}
                  </div>
                </>
              )}
          </div>
        </div>
        {merchantData?.isApplyLegitScript ? (
          <div className="w-full mx-auto mt-4">
            <p className="text-xs text-center text-muted-foreground">
              The statements made regarding these products have not been
              evaluated by the Food and Drug Administration. The efficacy of
              these products has not been confirmed by FDA-apporved research.
              These products are not intended to diagnose, treat, cure or
              prevent any disease.
            </p>
          </div>
        ) : null}
        {/* Bottom Bar */}
        <div className="border-t footer-border mt-4 text-center">
          <p className="footer-text-muted text-sm pt-8 ">
            &copy; <span suppressHydrationWarning>{getCurrentYear()}</span>{" "}
            {merchantData?.customizeBranding?.platformDisplayName || APP_NAME}.
            All rights reserved. | Licensed Medical Professionals
          </p>
        </div>
      </div>
    </footer>
  );
};

export default DefaultFooter;
