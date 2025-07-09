"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Corporate Gifting?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join hundreds of companies who trust Hyre Health for their corporate
            gift needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              variant="secondary"
              className="px-8 py-4 text-lg font-semibold"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600"
            >
              <Mail className="mr-2 h-5 w-5" />
              Contact Sales
            </Button>
          </div>

          <div className="mt-12 text-sm text-blue-200">
            No setup fees • Cancel anytime • 24/7 support
          </div>
        </div>
      </div>
    </section>
  );
}
