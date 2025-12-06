import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const db = await getDatabase()
    const body = await request.json()
    
    const result = await db.collection('testimonials').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: body }
    )
    
    return Response.json(result)
  } catch (error) {
    return Response.json({ error: 'Failed to update testimonial' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const db = await getDatabase()
    const result = await db.collection('testimonials').deleteOne(
      { _id: new ObjectId(params.id) }
    )
    return Response.json(result)
  } catch (error) {
    return Response.json({ error: 'Failed to delete testimonial' }, { status: 500 })
  }
}
