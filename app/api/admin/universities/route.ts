import { getDatabase } from '@/lib/mongodb'
import { University } from '@/models/University'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const db = await getDatabase()
    const universities = await db.collection<University>('universities').find({}).sort({ order: 1 }).toArray()
    return Response.json(universities)
  } catch (error) {
    console.error('Failed to fetch universities:', error)
    return Response.json({ error: 'Failed to fetch universities' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDatabase()
    const body = await request.json()

    // Validate required fields from University model
    if (!body.name || !body.country || !body.image || !body.description || !body.priceRange || body.order === undefined) {
      return Response.json(
        { error: 'Missing required fields: name, country, image, description, priceRange, order' },
        { status: 400 }
      )
    }

    const university: University = {
      name: body.name,
      country: body.country,
      image: body.image,
      description: body.description,
      website: body.website || '',
      subjects: body.subjects || [],
      priceRange: {
        min: body.priceRange.min || 0,
        max: body.priceRange.max || 0,
        currency: body.priceRange.currency || 'USD',
      },
      requirements: {
        ielts: body.requirements?.ielts,
        duolingo: body.requirements?.duolingo,
        toefl: body.requirements?.toefl,
        gre: body.requirements?.gre,
      },
      acceptanceRate: body.acceptanceRate,
      ranking: body.ranking,
      featuredPrograms: body.featuredPrograms || [],
      order: body.order,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<University>('universities').insertOne(university)

    return Response.json(
      { _id: result.insertedId, ...university },
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to create university:', error)
    return Response.json({ error: 'Failed to create university' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const db = await getDatabase()
    const body = await request.json()

    if (!body._id) {
      return Response.json(
        { error: 'Missing university ID' },
        { status: 400 }
      )
    }

    const { _id, ...updateData } = body

    const result = await db.collection('universities').updateOne(
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
        { error: 'University not found' },
        { status: 404 }
      )
    }

    return Response.json({ success: true, modifiedCount: result.modifiedCount })
  } catch (error) {
    console.error('Failed to update university:', error)
    return Response.json({ error: 'Failed to update university' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const db = await getDatabase()
    const body = await request.json()

    if (!body._id) {
      return Response.json(
        { error: 'Missing university ID' },
        { status: 400 }
      )
    }

    const result = await db.collection('universities').deleteOne(
      { _id: new ObjectId(body._id) }
    )

    if (result.deletedCount === 0) {
      return Response.json(
        { error: 'University not found' },
        { status: 404 }
      )
    }

    return Response.json({ success: true, deletedCount: result.deletedCount })
  } catch (error) {
    console.error('Failed to delete university:', error)
    return Response.json({ error: 'Failed to delete university' }, { status: 500 })
  }
}
