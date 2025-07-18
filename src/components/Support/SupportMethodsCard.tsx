"use client";
import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Clock, Phone, Mail } from "lucide-react";
import { contactMethods } from "@/configs/constants";

const SupportMethodsCard = () => {
  const _getIcon = (icon: string) => {
    switch (icon) {
      case "Phone":
        return Phone;
      case "Mail":
        return Mail;
      default:
        return Clock;
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-12">
      {contactMethods?.map((method, index) => {
        const Icon = _getIcon(method?.icon);

        return (
          <Card
            key={index}
            className={`relative ${
              method?.primary ? "ring-2 ring-blue-600" : ""
            }`}
          >
            {method?.primary && (
              <Badge className="absolute -top-2 left-4 bg-blue-600">
                Recommended
              </Badge>
            )}
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">{method?.method}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">{method?.description}</p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                <Clock className="h-4 w-4" />
                {method?.availability}
              </div>
              <Button
                className="w-full"
                variant={method?.primary ? "default" : "outline"}
                onClick={() => {
                  if (method?.action === "Call Now") {
                    window.location.href = `tel:${method?.contact}`;
                  } else if (method?.action === "Email Now") {
                    window.location.href = `mailto:${method?.contact}`;
                  }
                }}
              >
                {method?.action}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SupportMethodsCard;
