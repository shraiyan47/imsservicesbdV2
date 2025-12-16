'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Blog } from '@/models/Blog'

export default function Blog() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/admin/blogs')
        const data = await res.json()
        // Filter published blogs and sort by order, then by date
        const publishedBlogs = data.filter((blog: Blog) => blog.published).sort((a: Blog, b: Blog) => {
          if (a.order !== b.order) return a.order - b.order
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        })
        setBlogs(publishedBlogs)
      } catch (error) {
        console.error('Error fetching blogs:', error)
        setBlogs([])
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % (blogs.length || 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + (blogs.length || 1)) % (blogs.length || 1))
  }

  // Format date
  const formatDate = (date?: Date) => {
    if (!date) return 'Recent'
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-navy-dark">Latest Blog Posts</h2>
          </div>
          <div className="flex items-center justify-center min-h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </section>
    )
  }

  if (blogs.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-navy-dark">Latest Blog Posts</h2>
            <p className="text-lg text-muted-foreground">No blogs available yet</p>
          </div>
        </div>
      </section>
    )
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
                <div key={blog._id || blog.slug} className="w-full shrink-0">
                  <Card className="m-2 h-full">
                    <CardHeader>
                      <CardTitle className="text-navy-dark line-clamp-2">{blog.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-2">
                        {formatDate(blog.createdAt)} {blog.author && `• ${blog.author}`}
                      </p>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-between h-full">
                      <p className="text-muted-foreground mb-6 line-clamp-3">{blog.excerpt}</p>
                      <Link href={`/blogs/${blog.slug}`}>
                        <Button className="bg-purple-accent hover:bg-purple-accent/90 w-full" variant="default">
                          Read More
                        </Button>
                      </Link>
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
              disabled={blogs.length <= 1}
            >
              <ChevronLeft size={20} />
            </Button>
            <Button 
              onClick={nextSlide}
              className="bg-purple-accent hover:bg-purple-accent/90 rounded-full p-2"
              size="icon"
              disabled={blogs.length <= 1}
            >
              <ChevronRight size={20} />
            </Button>
          </div>

          {/* View All Blogs Button */}
          <div className="flex justify-center mt-8">
            <Link href="/blogs">
              <Button className="bg-navy-dark hover:bg-navy-dark/90 gap-2 px-6 py-2 text-base" variant="default">
                View All Blogs <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
