import { getDatabase } from '@/lib/mongodb'
import { Blog } from '@/models/Blog'
import { ObjectId } from 'mongodb'

// Utility function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function GET() {
  try {
    const db = await getDatabase()
    const blogs = await db.collection<Blog>('blogs').find({ published: true }).sort({ order: 1, createdAt: -1 }).toArray()
    return Response.json(blogs)
  } catch (error) {
    console.error('Failed to fetch blogs:', error)
    return Response.json({ error: 'Failed to fetch blogs' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDatabase()
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.content || !body.excerpt || !body.metaDescription) {
      return Response.json(
        { error: 'Missing required fields: title, content, excerpt, metaDescription' },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    const slug = body.slug || generateSlug(body.title)

    // Check if slug already exists
    const existingBlog = await db.collection<Blog>('blogs').findOne({ slug })
    if (existingBlog) {
      return Response.json(
        { error: 'Blog with this slug already exists' },
        { status: 400 }
      )
    }

    const blog: Blog = {
      title: body.title,
      slug,
      content: body.content,
      excerpt: body.excerpt,
      author: body.author || 'IMS Services',
      tags: body.tags || [],
      metaTags: body.metaTags || [],
      metaDescription: body.metaDescription,
      featuredImage: body.featuredImage || '',
      featured: body.featured || false,
      order: body.order || 0,
      published: body.published !== undefined ? body.published : true,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Blog>('blogs').insertOne(blog)

    return Response.json(
      { _id: result.insertedId, ...blog },
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to create blog:', error)
    return Response.json({ error: 'Failed to create blog' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const db = await getDatabase()
    const body = await request.json()

    if (!body._id) {
      return Response.json(
        { error: 'Missing blog ID' },
        { status: 400 }
      )
    }

    const { _id, ...updateData } = body

    // If slug is being updated, check if new slug is unique
    if (updateData.slug) {
      const existingBlog = await db.collection('blogs').findOne({
        slug: updateData.slug,
        _id: { $ne: new ObjectId(_id) },
      })
      if (existingBlog) {
        return Response.json(
          { error: 'Blog with this slug already exists' },
          { status: 400 }
        )
      }
    }

    const result = await db.collection('blogs').updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return Response.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    return Response.json({ success: true, modifiedCount: result.modifiedCount })
  } catch (error) {
    console.error('Failed to update blog:', error)
    return Response.json({ error: 'Failed to update blog' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const db = await getDatabase()
    const body = await request.json()

    if (!body._id) {
      return Response.json(
        { error: 'Missing blog ID' },
        { status: 400 }
      )
    }

    const result = await db.collection('blogs').deleteOne(
      { _id: new ObjectId(body._id) }
    )

    if (result.deletedCount === 0) {
      return Response.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    return Response.json({ success: true, deletedCount: result.deletedCount })
  } catch (error) {
    console.error('Failed to delete blog:', error)
    return Response.json({ error: 'Failed to delete blog' }, { status: 500 })
  }
}
