import { Button } from '@/components/ui/button'
import { Check, CheckCircle } from 'lucide-react'
import React from 'react'

const HomeHowItWorks = () => {
  return (
    <>
     <section className="py-16 bg-[#ffffff] px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-bold text-gray-900 mb-4 text-3xl">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Get started with personalized healthcare in four simple steps, all from the comfort of your home.
            </p>
          </div>
          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Complete Assessment",
                description: "Fill out our comprehensive medical questionnaire and upload any relevant health records."
              },
              {
                step: "2",
                title: "Physician Consultation",
                description: "Connect with a licensed physician who will review your case and create a personalized treatment plan."
              },
              {
                step: "3",
                title: "Prescription & Delivery",
                description: "Receive your physician-prescribed treatments delivered discreetly to your door with detailed instructions."
              },
              {
                step: "4",
                title: "Ongoing Support",
                description: "Regular check-ins with your care team to monitor progress and adjust treatments as needed."
              }
            ].map((step, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold text-gray-700">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 text-xl">{step.title}</h3>
                  <p className="font-body text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center p-8 rounded-xl border border-border bg-[#dbd9d633] ">
            <div className="">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-black" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-xl">Ready to Get Started?</h3>
              <p className="text-gray-600 mb-4 text-base">Take the first step towards better health with a quick consultation.</p>
              {/* <Button 
                className="bg-blue-900 hover:bg-blue-800 text-white h-12 px-8 text-base hover:brightness-95"
              >
                Get Started Today
              </Button> */}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default HomeHowItWorks