"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const FooterCTASection = () => {
  const router = useRouter();

  return (
    <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <CardContent className="text-center py-12">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl mb-8 text-blue-100">
          Join thousands of patients who trust HealthPortal for their health
          needs
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100"
            onClick={() => router.push("/products")}
          >
            Browse Treatments
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-blue-600"
            onClick={() => router.push("/support")}
          >
            Have Questions?
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FooterCTASection;
