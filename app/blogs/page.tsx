'use client'

import { useState, useEffect } from 'react'
import { Blog } from '@/models/Blog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import Image from 'next/image'

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/blogs')
      const data = await res.json()
      setBlogs(data)
      setFilteredBlogs(data)
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = blogs

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter((blog) => blog.tags.includes(selectedTag))
    }

    setFilteredBlogs(filtered)
  }, [searchTerm, selectedTag, blogs])

  // Get all unique tags
  const allTags = Array.from(new Set(blogs.flatMap((blog) => blog.tags)))

  // Featured blog
  const featuredBlog = blogs.find((blog) => blog.featured)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blogs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">IMS Services Blog</h1>
          <p className="text-purple-100 text-lg">
            Expert insights on international education, universities, and student guidance
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Featured Blog */}
        {featuredBlog && (
          <div className="mb-12">
            <Link href={`/blogs/${featuredBlog.slug}`}>
              <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer">
                <div className="grid md:grid-cols-2 gap-6 p-8">
                  {featuredBlog.featuredImage && (
                    <div className="relative h-64 md:h-auto">
                      <Image
                        src={featuredBlog.featuredImage}
                        alt={featuredBlog.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                        Featured
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">{featuredBlog.title}</h2>
                      <p className="text-gray-600 mb-4">{featuredBlog.excerpt}</p>
                    </div>
                    <div>
                      <Button className="bg-purple-600 hover:bg-purple-700">Read More</Button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <Input
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedTag === null
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedTag === tag
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Blogs Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No blogs found. Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <Link key={blog._id} href={`/blogs/${blog.slug}`}>
                <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition h-full">
                  {blog.featuredImage && (
                    <div className="relative h-48">
                      <Image
                        src={blog.featuredImage}
                        alt={blog.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {blog.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{blog.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{blog.author}</span>
                      <span>{new Date(blog.createdAt || '').toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
