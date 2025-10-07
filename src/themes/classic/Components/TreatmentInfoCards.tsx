"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Clock, 
  Truck, 
  Shield 
} from "lucide-react";

const TreatmentInfoCards = () => {
  return (
    <div className="bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Benefits Card */}
          <Card className="bg-white rounded-lg shadow-md">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-800 font-serif mb-6">
                Benefits
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">
                    Enhanced focus and concentration
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">
                    Improved memory formation and recall
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">
                    Reduced mental fatigue
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">
                    Better stress resilience
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Possible Side Effects Card */}
          <Card className="bg-white rounded-lg shadow-md">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-800 font-serif mb-6">
                Possible Side Effects
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">
                    Generally well-tolerated
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">
                    Possible mild headache initially
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">
                    Rare: digestive sensitivity
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">
                    May cause vivid dreams
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Treatment Information Card */}
          <Card className="bg-white rounded-lg shadow-md">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-800 font-serif mb-6">
                Treatment Information
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">
                    Licensed physician consultation required
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">
                    Monthly follow-ups included
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <Truck className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">
                    Free shipping & discreet packaging
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">
                    HIPAA-compliant care
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TreatmentInfoCards;
