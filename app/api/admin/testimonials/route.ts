import { getDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getDatabase()
    const testimonials = await db.collection('testimonials').find({}).toArray()
    return Response.json(testimonials)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDatabase()
    const body = await request.json()
    
    const result = await db.collection('testimonials').insertOne({
      ...body,
      createdAt: new Date(),
    })
    
    return Response.json(result, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Failed to create testimonial' }, { status: 500 })
  }
}
