'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const blogs = [
  {
    id: 1,
    title: 'Top 10 Universities for Computer Science',
    excerpt: 'Discover the world\'s leading institutions for CS education',
    date: 'Nov 10, 2025',
    author: 'Dr. Smith'
  },
  {
    id: 2,
    title: 'Scholarship Opportunities 2025',
    excerpt: 'Complete guide to finding and applying for scholarships',
    date: 'Nov 8, 2025',
    author: 'Maria Garcia'
  },
  {
    id: 3,
    title: 'IELTS Preparation Tips',
    excerpt: 'Master the test with proven strategies and techniques',
    date: 'Nov 5, 2025',
    author: 'John Williams'
  }
]

export default function Blog() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % blogs.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + blogs.length) % blogs.length)
  }

  return (
    <section className="py-16 md:py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-navy-dark">Latest Blog Posts</h2>
          <p className="text-lg text-muted-foreground">Insights and tips for your education journey</p>
        </div>

        <div className="relative">
          {/* Blog Cards Carousel */}
          <div className="flex overflow-hidden rounded-lg">
            <div 
              className="flex transition-transform duration-300 w-full"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {blogs.map((blog) => (
                <div key={blog.id} className="w-full flex-shrink-0">
                  <Card className="m-2">
                    <CardHeader>
                      <CardTitle className="text-navy-dark">{blog.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-2">{blog.date} • {blog.author}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-6">{blog.excerpt}</p>
                      <Button className="bg-purple-accent hover:bg-purple-accent/90" variant="default">
                        Read More
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <Button 
              onClick={prevSlide}
              className="bg-navy-dark hover:bg-navy-dark/90 rounded-full p-2"
              size="icon"
            >
              <ChevronLeft size={20} />
            </Button>
            <Button 
              onClick={nextSlide}
              className="bg-purple-accent hover:bg-purple-accent/90 rounded-full p-2"
              size="icon"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
