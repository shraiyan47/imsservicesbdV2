import { getDatabase } from '@/lib/mongodb';
import { Country } from '@/models/Country';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = await getDatabase();
    const countriesCollection = db.collection<Country>('countries');

    const countries = await countriesCollection
      .find({})
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch countries' },
      { status: 500 }
    );
  }
}
