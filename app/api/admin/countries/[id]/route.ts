import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDatabase()
    const body = await request.json()
    
    // Remove _id from update body as it's immutable in MongoDB
    const { _id, ...updateData } = body
    
    const result = await db.collection('countries').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )
    
    return Response.json(result)
  } catch (error) {
    console.error('Country update error:', error)
    return Response.json({ error: 'Failed to update country', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDatabase()
    console.log("DELETE COUNTRY : ", id)
    const result = await db.collection('countries').deleteOne(
      { _id: new ObjectId(id) }
    )
    return Response.json(result)
  } catch (error) {
    console.error('Country delete error:', error)
    return Response.json({ error: 'Failed to delete country', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
