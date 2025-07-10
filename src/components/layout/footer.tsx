"use client";

import { Gift, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-bg footer-text">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 footer-logo-bg rounded-lg flex items-center justify-center">
                <Gift className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Hyre Health</span>
            </div>
            <p className="footer-text-muted">
              Hyre Health is a platform that helps you manage your health.
            </p>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
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
                <Link
                  href="/security"
                  className="footer-link transition-colors"
                >
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t footer-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="footer-text-muted text-sm">
            © <span suppressHydrationWarning>{currentYear}</span> Hyre Health.
            All rights reserved. qwe
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="footer-link transition-colors text-sm"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="footer-link transition-colors text-sm"
            >
              Terms
            </Link>
            <Link
              href="/cookies"
              className="footer-link transition-colors text-sm"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
