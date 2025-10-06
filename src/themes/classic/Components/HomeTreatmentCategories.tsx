"use client"

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Leaf, Zap, Dna, Scale, Shield, Brain, ChevronRight } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

const HomeTreatmentCategories = () => {
  const { merchantData } = useSelector(
    (state: RootState) => state?.merchantReducer
  );

  return (
    <>
      <section className="py-16 bg-white px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-bold text-gray-900 mb-4 text-3xl">
              Treatment Categories
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Discover personalized treatments across our specialized wellness categories,
              each backed by clinical research and physician oversight.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Scale,
                title: "Weight Loss",
                description: "Clinically-proven treatments for sustainable weight management",
                count: "8 treatments",
                color: "bg-yellow-100 text-yellow-600"
              },
              {
                icon: Dna,
                title: "Peptides",
                description: "Advanced peptide therapies for enhanced wellness",
                count: "12 treatments",
                color: "bg-pink-100 text-pink-600"
              },
              {
                icon: Zap,
                title: "Hormone Therapy",
                description: "Hormone optimization for improved vitality",
                count: "6 treatments",
                color: "bg-orange-100 text-orange-600"
              },
              {
                icon: Leaf,
                title: "Wellness",
                description: "Comprehensive wellness and longevity solutions",
                count: "15 treatments",
                color: "bg-green-100 text-green-600"
              },
              {
                icon: Shield,
                title: "Immune Support",
                description: "Strengthen your immune system naturally",
                count: "7 treatments",
                color: "bg-blue-100 text-blue-600"
              },
              {
                icon: Brain,
                title: "Cognitive Enhancement",
                description: "Boost focus, memory, and mental clarity",
                count: "9 treatments",
                color: "bg-purple-100 text-purple-600"
              }
            ].map((category, index) => (
              <Card key={index} className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow relative flex flex-col h-full">
                {/* Treatment count badge - top right */}
                <div className='flex-1'>
                  <div className="absolute top-4 right-4">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </div>

                  {/* Content area - grows to fill available space */}
                  <div className="flex-1">
                    {/* Icon - top left */}
                    <div className={`${category.color} rounded-lg p-3 w-14 h-14 flex items-center justify-center mb-4`}>
                      <category.icon className="w-10 h-10" />
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 mb-2 text-left text-lg">{category.title}</h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 text-left">{category.description}</p>
                  </div>
                </div>

                {/* Explore button - always at bottom */}
                <div className="mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-white border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400 font-semibold text-sm h-10 px-3 justify-center group"
                    style={{
                      borderColor: merchantData?.customizeBranding?.accentColor || '#1e40af',
                      color: merchantData?.customizeBranding?.accentColor || '#1e40af'
                    }}
                  >
                    Explore Treatments
                    <ChevronRight className="ml-1 w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default HomeTreatmentCategories