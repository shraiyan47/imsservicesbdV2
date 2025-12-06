import { getDatabase } from '@/lib/mongodb';
import { ContactSubmission } from '@/models/ContactSubmission';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDatabase();
    const contactCollection = db.collection<ContactSubmission>('contactSubmissions');

    console.log("HO MA SA >> ",body)

    const submission: ContactSubmission = {
      ...body,
      submittedAt: new Date(),
      read: false,
    };

    const result = await contactCollection.insertOne(submission);

    return NextResponse.json(
      { message: 'Contact submission successful', id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}
