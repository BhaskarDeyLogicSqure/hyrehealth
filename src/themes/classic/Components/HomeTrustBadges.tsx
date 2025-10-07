import React from 'react'
import { Award, ShieldCheck, Users, Truck } from 'lucide-react'

const HomeTrustBadges = () => {
  const badges = [
    {
      icon: ShieldCheck,
      title: "HIPAA Compliant",
      description: "Your health data is protected"
    },
    {
      icon: Users,
      title: "Licensed Physicians",
      description: "Board-certified doctors"
    },
    {
      icon: Award,
      title: "FDA Approved",
      description: "Clinically proven treatments"
    },
    {
      icon: Truck,
      title: "Free Shipping",
      description: "Discreet delivery nationwide"
    }
  ]

  return (
    <section className="py-8 px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center">
          {badges.map((badge, index) => (
            <React.Fragment key={index}>
              <div className="flex-1 flex flex-col items-center text-center px-6 py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <badge.icon className="w-8 h-8 text-blue-900" strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg font-serif">{badge.title}</h3>
                <p className="text-gray-700 text-sm font-sans">{badge.description}</p>
              </div>
              {index < badges.length - 1 && (
                <div className="hidden md:block w-px h-20 bg-gray-300 mx-2"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomeTrustBadges