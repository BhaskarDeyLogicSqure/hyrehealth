"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Quote } from "lucide-react";
import React, { useMemo, useEffect, useState, useRef } from "react";
import { getFullName } from "@/lib/utils";
import { Testimonial } from "@/types/profile";

const HomePatientSuccessStrories = ({
  testimonials,
}: {
  testimonials: Testimonial[];
}) => {
  if (!testimonials?.length) return null;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const testimonialsPerPage = 3;
  const totalPages = Math.ceil(testimonials?.length / testimonialsPerPage);
  const shouldShowCarousel = testimonials?.length > 3;

  if (!testimonials || !testimonials?.length) return null;

  const _nextSlide = () => {
    if (isTransitioning) return;
    setCurrentSlide((prev) => (prev + 1) % testimonials?.length);
  };

  const _prevSlide = () => {
    if (isTransitioning) return;
    setCurrentSlide(
      (prev) => (prev - 1 + testimonials?.length) % testimonials?.length
    );
  };

  const _goToPage = (pageIndex: number) => {
    if (isTransitioning) return;
    // Calculate the starting slide for this page
    const startSlide = Math.floor(
      (pageIndex * testimonials?.length) / totalPages
    );
    setCurrentSlide(startSlide);
  };

  const _getCurrentPage = () => {
    // Calculate which page we're currently on
    return Math.floor((currentSlide * totalPages) / testimonials?.length);
  };

  const _getTransformValue = () => {
    if (!shouldShowCarousel) return "translateX(0)";

    const cardWidth = 100 / 3; // Each card takes 33.33% width when showing 3 cards
    const translateX = -currentSlide * cardWidth;
    return `translateX(${translateX}%)`;
  };

  const _getTestimonialsWithReviewText = useMemo(() => {
    return testimonials?.filter(
      (testimonial: Testimonial) => testimonial?.reviewText
    );
  }, [testimonials]);

  // Handle smooth infinite loop
  useEffect(() => {
    if (!shouldShowCarousel || !containerRef.current) return;

    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Match the transition duration

    return () => clearTimeout(timer);
  }, [currentSlide, shouldShowCarousel]);

  const TestimonialCard = ({
    testimonial,
    index,
  }: {
    testimonial: Testimonial;
    index: number;
  }) => (
    <Card
      key={index}
      className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Quote icon - top left */}
      <div className="mb-4">
        <Quote className="w-8 h-8 text-gray-300" />
      </div>

      {/* Testimonial text */}
      <p className="text-gray-600 mb-4 italic text-base leading-relaxed">
        "{testimonial?.reviewText || ""}"
      </p>

      {/* Separator line */}
      <div className="border-t border-gray-200 mb-4"></div>

      {/* Patient details and rating */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-semibold text-gray-900 text-base">
            {getFullName(testimonial?.createdBy)}{" "}
          </p>
          {/* <p className="text-gray-500 text-sm">
                    {testimonial.location}
                  </p> */}
        </div>
        <div className="flex items-center gap-1">
          {[...Array(testimonial?.rating || 0)]?.map((_, i: number) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>

      {/* Treatment tag - bottom left */}
      {/* <div className="flex justify-start">
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {testimonial.program}
                </span>
              </div> */}
    </Card>
  );

  return (
    <section className="py-16 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-bold text-gray-900 mb-4 text-3xl">
            Patient Success Stories
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Real results from real patients who have transformed their health
            with our treatments.
          </p>
        </div>

        {shouldShowCarousel ? (
          <div className="relative">
            {/* Carousel Container */}
            <div className="overflow-hidden py-4">
              <div
                ref={containerRef}
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: _getTransformValue() }}
              >
                {_getTestimonialsWithReviewText?.map(
                  (testimonial: Testimonial, index: number) => (
                    <div
                      key={`slide-${index}`}
                      className="w-1/3 flex-shrink-0 px-3"
                    >
                      <div className="transform hover:scale-105 transition-transform duration-300">
                        <TestimonialCard
                          testimonial={testimonial}
                          index={index}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Navigation Arrows */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 shadow-xl hover:shadow-2xl transition-all duration-300 w-12 h-12"
              onClick={_prevSlide}
            >
              <ChevronLeft className="h-5 w-5 text-blue-600" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 shadow-xl hover:shadow-2xl transition-all duration-300 w-12 h-12"
              onClick={_nextSlide}
            >
              <ChevronRight className="h-5 w-5 text-blue-600" />
            </Button>

            {/* Page Indicators */}
            <div className="flex justify-center mt-12 space-x-3">
              {Array.from({ length: totalPages })?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => _goToPage(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === _getCurrentPage()
                      ? "w-8 h-3 bg-blue-600 shadow-lg"
                      : "w-3 h-3 bg-gray-300 hover:bg-gray-400 hover:scale-110"
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          // Regular grid for 3 or fewer testimonials
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {_getTestimonialsWithReviewText?.map(
              (testimonial: Testimonial, index: number) => (
                <div
                  key={index}
                  className="transform hover:scale-105 transition-transform duration-300"
                >
                  <TestimonialCard testimonial={testimonial} index={index} />
                </div>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default HomePatientSuccessStrories;
