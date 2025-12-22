'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Partner {
  _id: string
  name: string
  logo: string
}

export default function Partners() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch('/api/partners')
        const data = await res.json()
        setPartners(data)
      } catch (error) {
        console.error('Error fetching partners:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPartners()
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(partners.length / 3))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(partners.length / 3)) % Math.ceil(partners.length / 3))
  }

  if (loading) {
    return (
      <section id="partners" className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-muted-foreground">Loading partners...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="partners" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-navy-dark">Our Partner Universities</h2>
          <p className="text-lg text-muted-foreground">Trusted by leading institutions worldwide</p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-12">
            {partners?.slice(currentIndex * 3, (currentIndex + 1) * 3).map((partner) => (
              <div 
                key={partner._id}
                className="flex items-center justify-center p-6 bg-muted rounded-lg hover:shadow-lg transition-shadow"
              >
                <img 
                  src={partner.logo || "/placeholder.svg"} 
                  alt={partner.name}
                  className="h-20 w-full object-contain"
                />
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          {partners.length > 3 && (
            <>
              <button 
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-navy-dark text-white p-2 rounded-full hover:bg-navy-dark/90"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-purple-accent text-white p-2 rounded-full hover:bg-purple-accent/90"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
