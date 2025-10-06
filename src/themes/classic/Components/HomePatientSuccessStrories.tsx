import { Card } from '@/components/ui/card'
import { Star } from 'lucide-react'
import { Quote } from 'lucide-react'
import React from 'react'

const HomePatientSuccessStrories = () => {
  return (
    <>
     <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-bold text-gray-900 mb-4 text-3xl">
              Patient Success Stories
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Real results from real patients who have transformed their health with our treatments.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "The weight loss program completely changed my life. Down 45 pounds in 6 months with professional support every step of the way.",
                patient: "Sarah M.",
                location: "Austin, TX",
                program: "Weight Loss Program",
                programColor: "bg-gray-100 text-gray-600"
              },
              {
                quote: "Testosterone therapy restored my energy and confidence. The telemedicine approach made it incredibly convenient.",
                patient: "David R.",
                location: "Denver, CO",
                program: "Hormone Therapy",
                programColor: "bg-gray-100 text-gray-600"
              },
              {
                quote: "The peptide therapy helped me recover from a sports injury faster than I thought possible. Amazing results.",
                patient: "Maria L.",
                location: "Miami, FL",
                program: "Peptide Therapy",
                programColor: "bg-gray-100 text-gray-600"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                {/* Quote icon - top left */}
                <div className="mb-4">
                  <Quote className="w-8 h-8 text-gray-300" />
                </div>
                
                {/* Testimonial text */}
                <p className="text-gray-600 mb-4 italic text-base leading-relaxed">"{testimonial.quote}"</p>
                
                {/* Separator line */}
                <div className="border-t border-gray-200 mb-4"></div>
                
                {/* Patient details and rating */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold text-gray-900 text-base">{testimonial.patient}</p>
                    <p className="text-gray-500 text-sm">{testimonial.location}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                
                {/* Treatment tag - bottom left */}
                <div className="flex justify-start">
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    {testimonial.program}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePatientSuccessStrories