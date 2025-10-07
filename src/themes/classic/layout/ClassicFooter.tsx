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
    <footer className="footer-first footer-bg footer-text py-12">``
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
              <strong>FDA Disclosure:</strong> The statements made regarding
              these products have not been evaluated by the Food and Drug
              Administration. The efficacy of these products has not been
              confirmed by FDA-apporved research. These products are not
              intended to diagnose, treat, cure or prevent any disease.
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

      <footer className="footer-second">
        {/* WellnessRx Footer Design */}
      <div className="bg-[#F8F7F5] text-[#475569] py-12 mt-8">
        <div className="container mx-auto px-4">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Column 1: Dynamic Branding & Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {merchantData?.customizeBranding?.businessLogo?.url ? (
                  <div className="w-10 h-10 bg-[#1E293B] rounded flex items-center justify-center overflow-hidden">
                    <Image
                      src={merchantData?.customizeBranding?.businessLogo?.url}
                      alt={merchantData?.customizeBranding?.platformDisplayName || "Logo"}
                      width={40}
                      height={40}
                      className="object-contain w-8 h-8"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-[#1E293B] rounded flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {merchantData?.customizeBranding?.platformDisplayName?.[0] || "W+"}
                    </span>
                  </div>
                )}
                <span className="text-xl font-bold text-[#1E293B] font-serif">
                  {merchantData?.customizeBranding?.platformDisplayName || "WellnessRx"}
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
                    href={`mailto:${merchantData?.supportEmail || "hello@wellnessrx.com"}`} 
                    className="hover:text-[#1E293B] transition-colors"
                  >
                    {merchantData?.supportEmail || "hello@wellnessrx.com"}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4" />
                  <a 
                    href={`tel:${merchantData?.supportPhone || "1-800-WELLNESS"}`} 
                    className="hover:text-[#1E293B] transition-colors"
                  >
                    {merchantData?.supportPhone || "1-800-WELLNESS"}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building className="w-4 h-4" />
                  <span>Licensed in all 50 states</span>
                </div>
              </div>
            </div>

            {/* Column 2: Treatments */}
            <div>
              <h3 className="font-bold text-[#1E293B] font-serif mb-4">Treatments</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/treatments/weight-loss" className="hover:text-[#1E293B] transition-colors">
                    Weight Loss
                  </Link>
                </li>
                <li>
                  <Link href="/treatments/peptides" className="hover:text-[#1E293B] transition-colors">
                    Peptides
                  </Link>
                </li>
                <li>
                  <Link href="/treatments/hormone-therapy" className="hover:text-[#1E293B] transition-colors">
                    Hormone Therapy
                  </Link>
                </li>
                <li>
                  <Link href="/treatments/wellness" className="hover:text-[#1E293B] transition-colors">
                    Wellness
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div>
              <h3 className="font-bold text-[#1E293B] font-serif mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="hover:text-[#1E293B] transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-[#1E293B] transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/physician-network" className="hover:text-[#1E293B] transition-colors">
                    Physician Network
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#1E293B] transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Support */}
            <div>
              <h3 className="font-bold text-[#1E293B] font-serif mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/patient-portal" className="hover:text-[#1E293B] transition-colors">
                    Patient Portal
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-[#1E293B] transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/insurance" className="hover:text-[#1E293B] transition-colors">
                    Insurance
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-[#1E293B] transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Legal Navigation */}
          <div className="border-t border-[#E2E8F0] pt-6 mb-6">
            <div className="flex flex-wrap gap-6 text-sm">
              <Link href="/privacy-policy" className="hover:text-[#1E293B] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-and-conditions" className="hover:text-[#1E293B] transition-colors">
                Terms of Service
              </Link>
              <Link href="/medical-disclaimer" className="hover:text-[#1E293B] transition-colors">
                Medical Disclaimer
              </Link>
              <Link href="/accessibility" className="hover:text-[#1E293B] transition-colors">
                Accessibility
              </Link>
            </div>
          </div>

          {/* Medical Disclaimer Box */}
          <div className="bg-[#F1F5F9] rounded-lg p-6 mb-6">
            <p className="text-sm leading-relaxed">
              <span className="font-bold">Important Medical Disclaimer:</span> This website is for informational purposes only and does not constitute medical advice. All treatments require a prescription from a licensed physician after a proper medical evaluation. Individual results may vary. Please consult with your healthcare provider before starting any new treatment.
            </p>
          </div>

          {/* Copyright & Security Information */}
          <div className="border-t border-[#E2E8F0] pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
              <div className="text-[#64748B]">
                © <span suppressHydrationWarning>{getCurrentYear()}</span>{" "}
                {merchantData?.customizeBranding?.platformDisplayName || "WellnessRx"}. All rights reserved. | Licensed Medical Professionals
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
        </div>
      </div>
      </footer>
    </>
  );
};

export default ClassicFooter;
