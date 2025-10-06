"use client"

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Star } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

const HomeFeaturedTreatments = () => {
  const { merchantData } = useSelector(
    (state: RootState) => state?.merchantReducer
  );

  return (
    <>
       <section className="px-6 py-16 lg:px-8 bg-[#dbd9d633]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-bold text-gray-900 mb-4 text-3xl">
              Featured Treatments
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Our most popular physician-prescribed treatments, trusted by thousands of patients nationwide.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: () => <span className="text-lg font-bold text-gray-700">S</span>,
                title: "Semaglutide",
                category: "Weight Loss",
                categoryColor: "bg-green-600 text-white",
                description: "Semaglutide mimics the GLP-1 hormone that targets areas of the brain that regulate appetite and food intake, leading to reduced hunger and calorie intake.",
                rating: 2847,
                price: 297,
                tags: ["FDA Approved", "Prescription Required"]
              },
              {
                icon: () => <span className="text-lg font-bold text-gray-700">N</span>,
                title: "NAD+ Therapy",
                category: "Wellness",
                categoryColor: "bg-green-600 text-white",
                description: "NAD+ (Nicotinamide Adenine Dinucleotide) is a coenzyme essential for cellular energy production and DNA repair mechanisms.",
                rating: 1523,
                price: 189,
                tags: ["Research-Backed", "Anti-Aging"]
              },
              {
                icon: () => <span className="text-lg font-bold text-gray-700">T</span>,
                title: "Testosterone Therapy",
                category: "Hormone Therapy",
                categoryColor: "bg-green-600 text-white",
                description: "Testosterone replacement therapy using bioidentical hormones to restore optimal levels and improve quality of life.",
                rating: 3621,
                price: 159,
                tags: ["Bioidentical", "Lab Monitored"]
              }
            ].map((treatment, index) => (
              <Card key={index} className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow relative flex flex-col h-full">
                {/* Category badge - top right */}
                <div className="absolute top-4 right-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${treatment.categoryColor}`}>
                    {treatment.category}
                  </span>
                </div>
                
                {/* Icon - top left */}
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <treatment.icon />
                </div>
                
                {/* Title */}
                <h3 className="font-bold text-gray-900 mb-3 text-lg">{treatment.title}</h3>
                
                {/* Description */}
                <p className="text-gray-600 text-sm mb-4">{treatment.description}</p>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">({treatment.rating} reviews)</span>
                </div>
                
                {/* Price */}
                <div className="mb-4">
                  <span className="text-2xl font-bold text-gray-900">${treatment.price}</span>
                  <span className="text-sm text-gray-600 ml-1">per month</span>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {treatment.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Spacer to push button to bottom */}
                <div className="flex-grow"></div>
                
                {/* Learn More button */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full bg-white font-normal text-sm h-8 px-3 mt-4"
                  style={{
                    borderColor: merchantData?.customizeBranding?.accentColor || '#1e40af',
                    color: merchantData?.customizeBranding?.accentColor || '#1e40af'
                  }}
                >
                  Learn More
                </Button>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-normal text-sm h-8 px-4 rounded-md"
            >
              View All Treatments
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

export default HomeFeaturedTreatments