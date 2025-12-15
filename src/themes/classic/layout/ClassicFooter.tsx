import React from "react";
import { APP_NAME } from "@/configs";
import { formatAddress, getCurrentYear } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { MerchantNMIpaymentTokenResponse } from "@/types/auth";
import { Mail, Phone, Building, Shield, Lock, CheckCircle } from "lucide-react";

const ClassicFooter = ({
  merchantData,
}: {
  merchantData: MerchantNMIpaymentTokenResponse["data"];
}) => {
  return (
    <>
      {/* <footer className="footer-second">
        <div className="bg-[#F8F7F5] text-[#475569] py-12 mt-8">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {merchantData?.customizeBranding?.businessLogo?.url ? (
                    <div className="w-10 h-10 bg-[#1E293B] rounded flex items-center justify-center overflow-hidden">
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
                    <div className="w-10 h-10 bg-[#1E293B] rounded flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {merchantData?.customizeBranding
                          ?.platformDisplayName?.[0] || "W+"}
                      </span>
                    </div>
                  )}
                  <span className="text-xl font-bold text-[#1E293B] font-serif">
                    {merchantData?.customizeBranding?.platformDisplayName ||
                      APP_NAME}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-[#475569]">
                  {merchantData?.customizeBranding?.platformTagline ||
                    "Transforming healthcare through personalized, physician-supervised treatments delivered directly to your door."}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4" />
                    <a
                      href={`mailto:${merchantData?.supportEmail}`}
                      className="hover:text-[#1E293B] transition-colors"
                    >
                      {merchantData?.supportEmail}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4" />
                    <a
                      href={`tel:${merchantData?.supportPhone}`}
                      className="hover:text-[#1E293B] transition-colors"
                    >
                      {merchantData?.supportPhone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="w-4 h-4" />
                    <span>Licensed in all 50 states</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-[#1E293B] font-serif mb-4">
                  Contact Information
                </h3>
                <ul className="space-y-2 text-sm">
                  {merchantData?.address?.zipCode ||
                  merchantData?.merchantAddress?.zipCode ? (
                    <li className="flex flex-col items-start gap-2">
                      <Label
                        htmlFor="supportAddress"
                        className="hover:text-[#1E293B] transition-colors"
                      >
                        Address:
                      </Label>
                      <p
                        id="merchantAddress"
                        className="hover:text-[#1E293B] transition-colors"
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
                      className="hover:text-[#1E293B] transition-colors"
                    >
                      Phone:
                    </Label>
                    <a
                      id="supportPhone"
                      href={`tel:${merchantData?.supportPhone}`}
                      className="hover:text-[#1E293B] transition-colors"
                    >
                      {merchantData?.supportPhone || "N/A"}
                    </a>
                  </li>
                  <li className="flex flex-col items-start gap-2">
                    <Label
                      htmlFor="supportEmail"
                      className="hover:text-[#1E293B] transition-colors"
                    >
                      Email:
                    </Label>
                    <a
                      id="supportEmail"
                      href={`mailto:${merchantData?.supportEmail}`}
                      className="hover:text-[#1E293B] transition-colors"
                    >
                      {merchantData?.supportEmail || "N/A"}
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-[#1E293B] font-serif mb-4">
                  Support
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/support"
                      className="hover:text-[#1E293B] transition-colors"
                    >
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/support"
                      className="hover:text-[#1E293B] transition-colors"
                    >
                      Support
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/how-it-works"
                      className="hover:text-[#1E293B] transition-colors"
                    >
                      How It Works
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                {merchantData?.customizeBranding?.socialMediaLinks &&
                  merchantData?.customizeBranding?.socialMediaLinks.length >
                    0 && (
                    <>
                      <h4 className="font-semibold mb-3 hover:text-[#1E293B] transition-colors text-sm">
                        Follow Us
                      </h4>
                      <div className="flex space-x-3">
                        {merchantData?.customizeBranding?.socialMediaLinks?.map(
                          (socialLink) => {
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
                                iconColor = "#6B7280";
                            }

                            return (
                              <Link
                                key={socialLink?.id}
                                href={socialLink?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[#1E293B] transition-colors text-muted-foreground hover:text-primary"
                                title={`Follow us on ${socialLink?.platform}`}
                              >
                                <IconComponent
                                  className="h-5 w-5"
                                  aria-label={socialLink?.platform}
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

            <div className="border-t border-[#E2E8F0] pt-6 mb-6">
              <div className="flex flex-wrap gap-6 text-sm">
                <Link
                  href="/privacy-policy"
                  className="hover:text-[#1E293B] transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms-and-conditions"
                  className="hover:text-[#1E293B] transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/return-policy"
                  className="hover:text-[#1E293B] transition-colors"
                >
                  Return / Refund Policy
                </Link>
              </div>
            </div>

            <div className="border-t border-[#E2E8F0] pt-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                <div className="text-[#64748B]">
                  © <span suppressHydrationWarning>{getCurrentYear()}</span>{" "}
                  {merchantData?.customizeBranding?.platformDisplayName ||
                    APP_NAME}
                  . All rights reserved. | Licensed Medical Professionals
                </div>
                <div className="flex items-center gap-4 text-[#64748B]">
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Lock className="w-4 h-4" />
                    <span>256-bit SSL Encryption</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>HIPAA Compliant</span>
                  </div>
                </div>
              </div>
            </div>
            {merchantData?.isApplyLegitScript ? (
              <div className="w-full mx-auto mt-8 max-w-xl">
                <p className="text-xs text-center mb-0 text-muted-foreground">
                  The statements made regarding these products have not been
                  evaluated by the Food and Drug Administration. The efficacy of
                  these products has not been confirmed by FDA-apporved research.
                  These products are not intended to diagnose, treat, cure or
                  prevent any disease.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </footer> */}
      <footer className="border-t bg-neutral-50" role="contentinfo">
        <div className="mx-auto w-full max-w-7xl px-6 py-10">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-3">
                {merchantData?.customizeBranding?.businessLogo?.url ? (
                  <div className="h-10 w-10 rounded-2xl bg-neutral-900 flex items-center justify-center overflow-hidden">
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
                  <div className="h-10 w-10 rounded-2xl bg-neutral-900 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {merchantData?.customizeBranding
                        ?.platformDisplayName?.[0] || "H"}
                    </span>
                  </div>
                )}
                <span className="text-xl font-semibold">
                  {merchantData?.customizeBranding?.platformDisplayName ||
                    APP_NAME}
                </span>
              </div>
              <p className="mt-3 text-sm text-neutral-600">
                {merchantData?.customizeBranding?.platformTagline ||
                  "Personalized telehealth treatments delivered to your door."}
              </p>
              <div className="mt-4 flex items-center gap-3">
                {merchantData?.customizeBranding?.socialMediaLinks &&
                  merchantData?.customizeBranding?.socialMediaLinks.length >
                    0 &&
                  merchantData?.customizeBranding?.socialMediaLinks?.map(
                    (socialLink) => {
                      let IconComponent;
                      switch (socialLink?.platform?.toLowerCase()) {
                        case "facebook":
                          IconComponent = require("lucide-react").Facebook;
                          break;
                        case "twitter":
                          IconComponent = require("lucide-react").Twitter;
                          break;
                        case "instagram":
                          IconComponent = require("lucide-react").Instagram;
                          break;
                        case "linkedin":
                          IconComponent = require("lucide-react").Linkedin;
                          break;
                        case "youtube":
                          IconComponent = require("lucide-react").Youtube;
                          break;
                        case "tiktok":
                          IconComponent = require("lucide-react").Tiktok;
                          break;
                        default:
                          IconComponent = require("lucide-react").Globe;
                      }

                      return (
                        <Link
                          key={socialLink?.id}
                          href={socialLink?.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={socialLink?.platform}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 hover:bg-white hover:text-neutral-900"
                        >
                          <IconComponent className="h-4 w-4" />
                        </Link>
                      );
                    }
                  )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                Contact
              </h3>
              <ul className="mt-3 space-y-2 text-sm">
                {merchantData?.address?.zipCode ||
                merchantData?.merchantAddress?.zipCode ? (
                  <li>
                    Address
                    <br />
                    {formatAddress(
                      merchantData?.address || merchantData?.merchantAddress
                    )}
                  </li>
                ) : null}
                <li>
                  Support:{" "}
                  <a
                    href={`mailto:${merchantData?.supportEmail}`}
                    className="underline underline-offset-2"
                  >
                    {merchantData?.supportEmail || "N/A"}
                  </a>
                </li>
                <li>
                  Phone:{" "}
                  <a
                    href={`tel:${merchantData?.supportPhone}`}
                    className="underline underline-offset-2"
                  >
                    {merchantData?.supportPhone || "N/A"}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                Support
              </h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link className="hover:underline" href="/how-it-works">
                    How it works
                  </Link>
                </li>
                <li>
                  <Link className="hover:underline" href="/support">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link className="hover:underline" href="/shop">
                    Shop Now
                  </Link>
                </li>
                <li>
                  <Link className="hover:underline" href="/support">
                    Contact support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                Legal
              </h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link className="hover:underline" href="/privacy-policy">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:underline"
                    href="/terms-and-conditions"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:underline"
                    href="/terms-and-conditions"
                  >
                    Platform Terms
                  </Link>
                </li>
                <li>
                  <Link className="hover:underline" href="/return-policy">
                    Return & Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 text-sm text-neutral-700 sm:grid-cols-2 md:grid-cols-4">
            <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2">
              <svg
                className="h-4 w-4 text-green-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              <span>Verified Medical Providers</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2">
              <svg
                className="h-4 w-4 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2">
              <svg
                className="h-4 w-4 text-purple-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2v20" />
              </svg>
              <span>256-bit SSL Encryption</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2">
              <svg
                className="h-4 w-4 text-orange-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3h18v18H3z" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
              <span>Trusted U.S. Pharmacy Network</span>
            </div>
          </div>

          <div className="my-8 h-px w-full bg-neutral-200"></div>

          <div className="space-y-4">
            {merchantData?.isApplyLegitScript ? (
              <p className="text-xs leading-relaxed text-neutral-600">
                The statements on this site have not been evaluated by the Food
                and Drug Administration. Prescriptions are issued at the
                discretion of a licensed medical provider. Products are not
                intended to diagnose, treat, cure, or prevent any disease.
              </p>
            ) : null}

            <p className="text-xs leading-relaxed text-neutral-600">
              HyrTech provides software and integrations only. We are not a
              healthcare provider. Compounded products are not approved nor
              evaluated for safety, effectiveness, or quality by the FDA.
              Results have not been independently verified. Individual results
              will vary.
            </p>

            <div className="flex flex-col items-start justify-between gap-3 border-t border-neutral-200 pt-4 text-xs text-neutral-500 md:flex-row">
              <p>
                © <span suppressHydrationWarning>{getCurrentYear()}</span>{" "}
                {merchantData?.customizeBranding?.platformDisplayName ||
                  APP_NAME}
                . All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ClassicFooter;
