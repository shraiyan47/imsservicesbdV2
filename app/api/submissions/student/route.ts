import { getDatabase } from '@/lib/mongodb';
import { StudentSubmission } from '@/models/StudentSubmission';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDatabase();
    const submissionsCollection = db.collection<StudentSubmission>('studentSubmissions');

    const submission: StudentSubmission = {
      ...body,
      submittedAt: new Date(),
      read: false,
    };

    const result = await submissionsCollection.insertOne(submission);

    return NextResponse.json(
      { message: 'Student submission successful', id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting student form:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}
