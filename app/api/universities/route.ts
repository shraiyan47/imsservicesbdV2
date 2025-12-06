import { getDatabase } from '@/lib/mongodb';
import { University } from '@/models/University';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const country = searchParams.get('country');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const subject = searchParams.get('subject');
    const minIelts = searchParams.get('minIelts');
    const minDuolingo = searchParams.get('minDuolingo');

    const db = await getDatabase();
    const universitiesCollection = db.collection<University>('universities');

    const filter: any = {};

    if (country) filter.country = country;
    if (subject) filter.subjects = { $in: [subject] };
    if (minPrice || maxPrice) {
      filter.priceRange = {};
      if (minPrice) filter['priceRange.max'] = { $gte: parseInt(minPrice) };
      if (maxPrice) filter['priceRange.min'] = { $lte: parseInt(maxPrice) };
    }
    if (minIelts) filter['requirements.ielts'] = { $lte: parseFloat(minIelts) };
    if (minDuolingo) filter['requirements.duolingo'] = { $lte: parseFloat(minDuolingo) };

    const universities = await universitiesCollection
      .find(filter)
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json(universities);
  } catch (error) {
    console.error('Error fetching universities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch universities' },
      { status: 500 }
    );
  }
}
