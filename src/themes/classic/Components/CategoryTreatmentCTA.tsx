"use client";
import { useRouter } from "next/navigation";
import React from "react";

const CategoryTreatmentCTA = () => {
  const router = useRouter();

  return (
    <div className="w-full py-16 px-4" style={{ backgroundColor: "#F8F8F8" }}>
      <div className="max-w-6xl mx-auto">
        <div
          className="rounded-lg p-12 text-center shadow-sm"
          style={{
            backgroundColor: "#EEEEEE",
            border: "1px solid #E0E0E0",
          }}
        >
          {/* Title */}
          <h2
            className="text-3xl md:text-4xl font-bold mb-6"
            style={{
              fontFamily: "Georgia, serif",
              color: "#212529",
            }}
          >
            Not Sure Which Treatment is Right for You?
          </h2>

          {/* Description */}
          <p
            className="text-lg mb-8 leading-relaxed"
            style={{
              fontFamily: "Arial, sans-serif",
              color: "#495057",
            }}
          >
            Take our quick assessment to get personalized treatment
            recommendations from our licensed physicians.
          </p>

          {/* CTA Button */}
          <button
            className="px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 hover:opacity-90"
            style={{
              backgroundColor: "#213B52",
              color: "#FFFFFF",
              fontFamily: "Arial, sans-serif",
            }}
            onClick={() => router.push("/products")}
          >
            Take Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryTreatmentCTA;
