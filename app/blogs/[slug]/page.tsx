import { getDatabase } from '@/lib/mongodb'
import { Blog } from '@/models/Blog'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface BlogPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const db = await getDatabase()
    const blog = await db.collection<Blog>('blogs').findOne({ slug: resolvedParams.slug })

    if (!blog) {
      return {
        title: 'Blog Not Found | IMS Services',
        description: 'The blog post you are looking for does not exist.',
      }
    }

    return {
      title: blog.title,
      description: blog.metaDescription,
      keywords: [...(blog.metaTags || []), ...((blog.tags as string[]) || [])],
      authors: [{ name: blog.author || 'IMS Services' }],
      openGraph: {
        title: blog.title,
        description: blog.metaDescription,
        type: 'article',
        images: blog.featuredImage
          ? [
              {
                url: blog.featuredImage,
                width: 1200,
                height: 630,
                alt: blog.title,
              },
            ]
          : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.title,
        description: blog.metaDescription,
        images: blog.featuredImage ? [blog.featuredImage] : [],
      },
      alternates: {
        canonical: `/blogs/${blog.slug}`,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Blog | IMS Services',
      description: 'Read our latest blog posts about international education.',
    }
  }
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const resolvedParams = await params
  const db = await getDatabase()
  const blog = await db.collection<Blog>('blogs').findOne({ slug: resolvedParams.slug })

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you are looking for does not exist.</p>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blogs
          </Link>
        </div>
      </div>
    )
  }

  // Increment views
  await db.collection('blogs').updateOne(
    { slug: blog.slug },
    { $inc: { views: 1 } }
  )

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.metaDescription,
    image: blog.featuredImage,
    author: {
      '@type': 'Organization',
      name: blog.author || 'IMS Services',
    },
    datePublished: blog.createdAt?.toISOString() || new Date().toISOString(),
    dateModified: blog.updatedAt?.toISOString() || new Date().toISOString(),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12">
          <div className="max-w-3xl mx-auto px-4">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-purple-100 hover:text-white mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blogs
            </Link>
            <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
            <p className="text-purple-100 text-lg">{blog.metaDescription}</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 py-12">
          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src={blog.featuredImage}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Meta Information */}
          <div className="bg-white p-6 rounded-lg mb-8 border border-gray-200">
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-4">
              <span>By {blog.author || 'IMS Services'}</span>
              <span>{new Date(blog.createdAt || '').toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</span>
              <span>{blog.views || 0} views</span>
            </div>

            {/* Tags */}
            {blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blogs?tag=${encodeURIComponent(tag)}`}
                    className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm hover:bg-purple-200"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Blog Content */}
          <article className="bg-white p-8 rounded-lg shadow-sm prose prose-lg max-w-none">
            <div
              className="text-gray-700 leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </article>

          {/* Meta Tags */}
          {blog.metaTags.length > 0 && (
            <div className="mt-8 bg-gray-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Topics</h3>
              <div className="flex flex-wrap gap-2">
                {blog.metaTags.map((metaTag) => (
                  <span
                    key={metaTag}
                    className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 text-sm"
                  >
                    {metaTag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-12 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4">Need Help with Your Education Journey?</h3>
            <p className="mb-6">
              Get expert guidance from IMS Services - Your trusted education consultancy in Bangladesh.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100"
            >
              Contact Us Today
            </Link>
          </div>

          {/* Related Articles */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <p className="text-gray-600 text-center py-8">
              More blog posts coming soon. Stay tuned for more insights!
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

// Generate static parameters for known blogs (ISR)
export async function generateStaticParams() {
  try {
    const db = await getDatabase()
    const blogs = await db.collection<Blog>('blogs').find({ published: true }).toArray()
    return blogs.map((blog) => ({
      slug: blog.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}
