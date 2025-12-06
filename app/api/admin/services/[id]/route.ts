import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params

  try {
    const db = await getDatabase()
    const body = await request.json()

    // Remove _id from update body to prevent MongoDB error
    const { _id, ...updateData } = body

    const result = await db.collection('services').findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        }
      },
      { returnDocument: 'after' }
    )

    return Response.json(result)
  } catch (error) {
    return Response.json({ error: 'Failed to update service >> ' + error }, { status: 500 })
  }
}



export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
           const db = await getDatabase()

    const result = await db.collection('services').deleteOne(
      { _id: new ObjectId(params.id) }
    )
    return Response.json(result)
  } catch (error) {
    return Response.json({ error: 'Failed to delete service' }, { status: 500 })
  }
}