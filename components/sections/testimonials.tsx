'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'
import { renderMarkdownToJSX } from '@/lib/markdown-renderer'

interface Testimonial {
  _id: string
  name: string
  country: string
  university: string
  comment: string
  rating: number
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials')
        const data = await res.json()
        setTestimonials(data)
      } catch (error) {
        console.error('Error fetching testimonials:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  if (loading) {
    return (
      <section id="testimonials" className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-muted-foreground">Loading testimonials...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-navy-dark">Success Stories</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from our students who achieved their dreams
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial._id} className="border-t-4 border-t-purple-accent">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="text-muted-foreground mb-6 italic">
                  {`"`}
                  {renderMarkdownToJSX(testimonial.comment)}
                  {`"`}
                </div>
                <div className="border-t pt-4">
                  <p className="font-semibold text-navy-dark">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.country}</p>
                  <p className="text-sm text-purple-accent font-medium">{testimonial.university}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
