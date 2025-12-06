import { getDatabase } from '@/lib/mongodb';
import { Service } from '@/models/Service';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = await getDatabase();
    const servicesCollection = db.collection<Service>('services');

    const services = await servicesCollection
      .find({})
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}
