import { getDatabase } from '@/lib/mongodb'
import { Blog } from '@/models/Blog'
import { Country } from '@/models/Country'
import { University } from '@/models/University'

export async function GET() {
  const db = await getDatabase()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ims-services.com'

  try {
    // Fetch all blogs
    const blogs = await db.collection<Blog>('blogs').find({ published: true }).toArray()

    // Fetch all countries
    const countries = await db.collection<Country>('countries').find({}).toArray()

    // Fetch all universities
    const universities = await db.collection<University>('universities').find({}).toArray()

    // Build sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main pages -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/universities</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/blogs</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Blog posts -->
  ${blogs
    .map(
      (blog) => `
  <url>
    <loc>${baseUrl}/blogs/${blog.slug}</loc>
    <lastmod>${new Date(blog.updatedAt || blog.createdAt || new Date()).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  `
    )
    .join('')}

  <!-- Universities -->
  ${universities
    .map(
      (uni) => `
  <url>
    <loc>${baseUrl}/universities?country=${encodeURIComponent(uni.country)}</loc>
    <lastmod>${new Date(uni.updatedAt || uni.createdAt || new Date()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  `
    )
    .join('')}
</urlset>`

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return new Response('Error generating sitemap', { status: 500 })
  }
}
