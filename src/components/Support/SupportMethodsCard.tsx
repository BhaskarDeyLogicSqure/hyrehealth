import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Clock, MessageCircle, Phone, Mail } from "lucide-react";
import { contactMethods } from "@/configs/constants";

const SupportMethodsCard = () => {
  const _getIcon = (icon: string) => {
    switch (icon) {
      case "MessageCircle":
        return MessageCircle;
      case "Phone":
        return Phone;
      case "Mail":
        return Mail;
      default:
        return Clock;
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-12">
      {contactMethods?.map((method, index) => {
        const Icon = _getIcon(method?.icon);

        return (
          <Card
            key={index}
            className="text-center hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{method?.method}</h3>
              <p className="text-gray-600 mb-2">{method?.description}</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">
                  {method?.availability}
                </span>
              </div>
              <Button className="w-full">{method?.action}</Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SupportMethodsCard;
