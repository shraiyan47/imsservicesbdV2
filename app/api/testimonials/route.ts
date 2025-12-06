import { getDatabase } from '@/lib/mongodb';
import { Testimonial } from '@/models/Testimonial';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = await getDatabase();
    const testimonialsCollection = db.collection<Testimonial>('testimonials');

    const testimonials = await testimonialsCollection
      .find({})
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}
