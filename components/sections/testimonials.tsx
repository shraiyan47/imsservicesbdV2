'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'
import { renderMarkdownToJSX } from '@/lib/markdown-renderer'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

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
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

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

  const handleViewMore = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial)
    setIsDialogOpen(true)
  }

  const truncateComment = (comment: string, limit: number = 300): { text: string; isTruncated: boolean } => {
    return {
      text: comment.length > limit ? comment.substring(0, limit) + '...' : comment,
      isTruncated: comment.length > limit,
    }
  }

  // Show only first 6 testimonials on home page
  const displayedTestimonials = testimonials.slice(0, 6)
  const hasMoreComments = testimonials.length > 6

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
          {displayedTestimonials.map((testimonial) => {
            const { text, isTruncated } = truncateComment(testimonial.comment)
            return (
              <Card key={testimonial._id} className="border-t-4 border-t-purple-accent bg-purple-50">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div className="text-muted-foreground mb-6 italic">
                    {`"`}
                    {renderMarkdownToJSX(text)}
                    {`"`}
                    {isTruncated && (
                      <button
                        onClick={() => handleViewMore(testimonial)}
                        className="ml-2 text-purple-accent font-medium hover:underline"
                      >
                        See More
                      </button>
                    )}
                  </div>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-navy-dark">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.country}</p>
                    <p className="text-sm text-purple-accent font-medium">{testimonial.university}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Check more Comments Button */}
        {hasMoreComments && (
          <div className="text-center mt-12">
            <Button
              onClick={() => router.push('/testimonials')}
              size="lg"
              className="bg-purple-accent hover:bg-purple-accent/90"
            >
              Check more Comments
            </Button>
          </div>
        )}
      </div>

      {/* Modal Dialog for Full Comment */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-yellow-50 rounded-lg p-6">
          <DialogHeader>
            <DialogTitle>Full Testimonial</DialogTitle>
          </DialogHeader>
          {selectedTestimonial && (
            <div className="space-y-4">
              <div className="flex gap-1 mb-4">
                {[...Array(selectedTestimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="text-muted-foreground italic leading-relaxed">
                {`"`}
                {renderMarkdownToJSX(selectedTestimonial.comment)}
                {`"`}
              </div>
              <div className="border-t pt-4">
                <p className="font-semibold text-navy-dark">{selectedTestimonial.name}</p>
                <p className="text-sm text-muted-foreground">{selectedTestimonial.country}</p>
                <p className="text-sm text-purple-accent font-medium">{selectedTestimonial.university}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
