import { getDatabase } from '@/lib/mongodb';
import { Partner } from '@/models/Partner';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = await getDatabase();
    const partnersCollection = db.collection<Partner>('partners');

    const partners = await partnersCollection
      .find({})
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json(partners);
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch partners' },
      { status: 500 }
    );
  }
}
