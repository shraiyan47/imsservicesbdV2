import { getDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getDatabase()
    const partners = await db.collection('partners').find({}).toArray()
    return Response.json(partners)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch partners' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDatabase()
    const body = await request.json()
    
    const result = await db.collection('partners').insertOne({
      ...body,
      createdAt: new Date(),
    })
    
    return Response.json(result, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Failed to create partner' }, { status: 500 })
  }
}
