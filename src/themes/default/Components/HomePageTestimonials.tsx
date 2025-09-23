"use client";

import { Testimonial } from "@/types/profile";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { getFullName } from "@/lib/utils";

const HomePageTestimonials = ({
  testimonials,
}: {
  testimonials: Testimonial[];
}) => {
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
      className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/30 shadow-lg hover:-translate-y-1"
    >
      <CardContent className="p-5 flex flex-col h-full min-h-[280px]">
        {/* Quote Icon */}
        <div className="mb-3">
          <svg
            className="w-6 h-6 text-blue-600/20"
            fill="currentColor"
            viewBox="0 0 32 32"
            aria-hidden="true"
          >
            <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
          </svg>
        </div>

        {/* Header Section - Name and Rating */}
        <div className="flex justify-between items-start mb-4">
          {/* Author Info */}
          <div className="flex items-center">
            {/* Avatar */}
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3 shadow-md">
              <span className="text-white font-semibold text-sm">
                {getFullName(testimonial?.createdBy)?.charAt(0)?.toUpperCase()}
              </span>
            </div>

            {/* Author Details */}
            <div>
              <p className="font-semibold text-gray-900 text-base">
                {getFullName(testimonial?.createdBy)}
              </p>
              <p className="text-gray-500 text-xs">Verified Customer</p>
            </div>
          </div>

          {/* Star Rating */}
          <div className="flex gap-1">
            {[...Array(5)]?.map((_, i: number) => (
              <Star
                key={i}
                className={`h-4 w-4 transition-colors ${
                  i < testimonial?.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Review Text */}
        <blockquote className="text-gray-700 leading-relaxed text-base italic flex-grow line-clamp-4">
          "{testimonial?.reviewText}"
        </blockquote>
      </CardContent>
    </Card>
  );

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Patients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories from our satisfied customers who have experienced the
            quality of our healthcare services
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

export default HomePageTestimonials;
