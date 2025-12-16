import { getDatabase } from '@/lib/mongodb'
import { Blog } from '@/models/Blog'
import { Country } from '@/models/Country'
import { University } from '@/models/University'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = await getDatabase()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ims-services.com'

  try {
    // Fetch all blogs
    const blogs = await db.collection<Blog>('blogs').find({ published: true }).toArray()

    // Fetch all countries
    const countries = await db.collection<Country>('countries').find({}).toArray()

    // Fetch all universities
    const universities = await db.collection<University>('universities').find({}).toArray()

    // Build sitemap entries
    const sitemapEntries: MetadataRoute.Sitemap = [
      // Main pages
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/universities`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/blogs`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },

      // Blog posts
      ...blogs.map((blog) => ({
        url: `${baseUrl}/blogs/${blog.slug}`,
        lastModified: new Date(blog.updatedAt || blog.createdAt || new Date()),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),

      // Universities
      ...universities.map((uni) => ({
        url: `${baseUrl}/universities?country=${encodeURIComponent(uni.country)}`,
        lastModified: new Date(uni.updatedAt || uni.createdAt || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })),
    ]

    return sitemapEntries
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return at least the main pages if there's an error
    return [
      {
        url: process.env.NEXT_PUBLIC_APP_URL || 'https://ims-services.com',
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 1.0,
      },
    ]
  }
}
