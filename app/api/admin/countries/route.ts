import { getDatabase } from '@/lib/mongodb'
import { Country } from '@/models/Country'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const db = await getDatabase()
    const countries = await db.collection<Country>('countries').find({}).sort({ order: 1 }).toArray()
    return Response.json(countries)
  } catch (error) {
    console.error('Failed to fetch countries:', error)
    return Response.json({ error: 'Failed to fetch countries' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDatabase()
    const body = await request.json()

    // Validate required fields from Country model
    if (!body.name || !body.title || !body.image) {
      return Response.json(
        { error: 'Missing required fields: name, title, image, order' },
        { status: 400 }
      )
    }

    const country: Country = {
      name: body.name,
      title: body.title,
      image: body.image,
      description: body.description || '',
      tag: body.tag || '',
      order: body.order,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Country>('countries').insertOne(country)

    return Response.json(
      { _id: result.insertedId, ...country },
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to create country:', error)
    return Response.json({ error: 'Failed to create country' }, { status: 500 })
  }
}
