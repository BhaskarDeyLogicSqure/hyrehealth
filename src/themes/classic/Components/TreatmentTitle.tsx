import { Container } from "lucide-react";
import React from "react";

const TreatmentTitle = () => {
  return (
    <>
      <section className="px-6 py-16 lg:px-8 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="font-display text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-foreground">
              Categories
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Explore our comprehensive range of physician-supervised treatments
              across multiple wellness categories. Each treatment is backed by
              clinical research and delivered with personalized care.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default TreatmentTitle;
