import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDatabase()
    const body = await request.json()

    console.log("Update: ",body)
    
    // Remove _id from update body as it's immutable in MongoDB
    const { _id, ...updateData } = body
    
    const result = await db.collection('partners').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )
    
    return Response.json(result)
  } catch (error) {
    console.error('Partner update error:', error)
    return Response.json({ error: 'Failed to update partner', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDatabase()
    const result = await db.collection('partners').deleteOne(
      { _id: new ObjectId(id) }
    )
    return Response.json(result)
  } catch (error) {
    console.error('Partner delete error:', error)
    return Response.json({ error: 'Failed to delete partner', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
