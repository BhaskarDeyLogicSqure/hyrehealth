"use client";

import { Clock } from "lucide-react";
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const NeedNewConsultation = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen theme-bg">
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold theme-text-primary">
            Ready to continue your treatment?
          </h1>

          <Card className="p-8">
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 theme-text-muted" />
              </div>
              <h2 className="text-xl font-semibold theme-text-primary">
                New Consultation Required
              </h2>
              <p className="theme-text-muted">
                You've completed a 3-month treatment cycle. To continue, you'll
                need a new consultation to ensure your treatment plan is still
                right for you.
              </p>
              <Button
                className="w-full mt-6"
                onClick={() => router.push("/products")}
              >
                Start New Consultation
              </Button>
            </div>
          </Card>

          <div className="text-sm theme-text-muted">
            Need help?{" "}
            <a href="#" className="theme-text-accent hover:underline">
              Contact Support
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NeedNewConsultation;
