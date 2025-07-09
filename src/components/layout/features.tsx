"use client";

import {
  CheckCircle,
  Palette,
  Users,
  Truck,
  BarChart3,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: CheckCircle,
    title: "Curated Gift Boxes",
    description:
      "Browse our professionally curated gift boxes or build your own custom collection.",
  },
  {
    icon: Palette,
    title: "Brand Personalization",
    description:
      "Add your company branding, custom messages, and personalized materials.",
  },
  {
    icon: Users,
    title: "Recipient Management",
    description:
      "Easily manage recipients with bulk upload, tagging, and contact organization.",
  },
  {
    icon: Truck,
    title: "Streamlined Delivery",
    description:
      "Reliable shipping with tracking and delivery confirmation for all orders.",
  },
  {
    icon: BarChart3,
    title: "Order Tracking",
    description:
      "Monitor your orders, track deliveries, and manage invoices from one dashboard.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-level security with secure payment processing and data protection.",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Corporate Gifting
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our platform provides all the tools and features you need to manage
            corporate gifts efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <feature.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
