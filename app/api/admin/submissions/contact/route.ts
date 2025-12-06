import { getDatabase } from '@/lib/mongodb';
import { ContactSubmission } from '@/models/ContactSubmission';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = await getDatabase();
    const contactCollection = db.collection<ContactSubmission>('contactSubmissions');

    const submissions = await contactCollection
      .find({})
      .sort({ submittedAt: -1 })
      .toArray();

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
