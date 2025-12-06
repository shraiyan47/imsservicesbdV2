import { getDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getDatabase()
    const services = await db.collection('services').find({}).toArray()

    return Response.json(services)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}


export async function POST(request: Request) {
  try {
    const db = await getDatabase()
    const body = await request.json()

    const result = await db.collection('services').insertOne({
      title: body.title,
      description: body.description,
      icon: body.icon,
      order: body.order || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return Response.json(result, { status: 201 })
  } catch (error) {
    return Response.json({ error: 'Failed to create service -> ' + error }, { status: 500 })
  }
}
