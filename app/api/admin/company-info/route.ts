import { getDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getDatabase()
    const companyInfo = await db.collection('company-info').findOne({})
    return Response.json(companyInfo)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch company info' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDatabase()
    const body = await request.json()
    
    const result = await db.collection('company-info').updateOne(
      {},
      { 
        $set: {
          ...body,
          updatedAt: new Date(),
        }
      },
      { upsert: true }
    )
    
    return Response.json(result)
  } catch (error) {
    return Response.json({ error: 'Failed to update company info' }, { status: 500 })
  }
}
