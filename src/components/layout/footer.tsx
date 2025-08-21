"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const pathname = usePathname();

  if (pathname.startsWith("/auth/")) {
    return null;
  }

  return (
    <footer className="footer-bg footer-text py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 footer-logo-bg rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold">H</span>
              </div>
              <span className="text-lg font-bold footer-text">
                HealthPortal
              </span>
            </div>
            <p className="footer-text-muted text-sm">
              Personalized telehealth treatments delivered to your door.
            </p>
          </div>

          {/* Treatments */}
          {/* <div>
            <h3 className="font-semibold mb-4 footer-text">Treatments</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/categories?category=weight-loss"
                  className="footer-link transition-colors"
                >
                  Weight Loss
                </Link>
              </li>
              <li>
                <Link
                  href="/categories?category=peptides"
                  className="footer-link transition-colors"
                >
                  Peptides
                </Link>
              </li>
              <li>
                <Link
                  href="/categories?category=wellness"
                  className="footer-link transition-colors"
                >
                  Wellness
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4 footer-text">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="footer-link transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="footer-link transition-colors">
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
                <Link href="/privacy" className="footer-link transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="footer-link transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/hipaa" className="footer-link transition-colors">
                  HIPAA Notice
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t footer-border mt-8 pt-8 text-center">
          <p className="footer-text-muted text-sm">
            &copy; <span suppressHydrationWarning>{currentYear}</span>{" "}
            HealthPortal. All rights reserved. | Licensed Medical Professionals
          </p>
        </div>
      </div>
    </footer>
  );
}
