import { getDatabase } from '@/lib/mongodb'
import { Blog } from '@/models/Blog'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const slug = searchParams.get('slug')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')

    const db = await getDatabase()

    let filter: any = { published: true }

    if (slug) {
      filter.slug = slug
    }

    if (tag) {
      filter.tags = { $in: [tag] }
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ]
    }

    const blogs = await db
      .collection<Blog>('blogs')
      .find(filter)
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .toArray()

    return NextResponse.json(blogs)
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    )
  }
}
