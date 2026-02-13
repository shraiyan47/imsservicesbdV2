'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Blog } from '@/models/Blog'

export default function Blog() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/blogs')
        const data = await res.json()
        // Filter published blogs and sort by recent first
        const publishedBlogs = data
          .filter((blog: Blog) => blog.published)
          .sort((a: Blog, b: Blog) => {
            // Sort by creation date (newest first)
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

  // Format date
  const formatDate = (date?: Date) => {
    if (!date) return 'Recent'
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  // Show only first 6 blogs on home page
  const displayedBlogs = blogs.slice(0, 6)
  const hasMoreBlogs = blogs.length > 6

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

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {displayedBlogs.map((blog) => (
            <Card key={blog._id || blog.slug} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-navy-dark line-clamp-2">{blog.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  {formatDate(blog.createdAt)} {blog.author && `• ${blog.author}`}
                </p>
              </CardHeader>
              <CardContent className="flex flex-col justify-between flex-grow">
                <p className="text-muted-foreground mb-6 line-clamp-3">{blog.excerpt}</p>
                <Link href={`/blogs/${blog.slug}`}>
                  <Button className="bg-purple-accent hover:bg-purple-accent/90 w-full" variant="default">
                    Read More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Check more Blogs Button */}
        {hasMoreBlogs && (
          <div className="text-center">
            <Button
              onClick={() => router.push('/blogs')}
              className="bg-navy-dark hover:bg-navy-dark/90 gap-2 px-6 py-2 text-base"
              variant="default"
            >
              Check more Blogs <ArrowRight size={18} />
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
