import { getDatabase } from '@/lib/mongodb';
import { StudentSubmission } from '@/models/StudentSubmission';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = await getDatabase();
    const submissionsCollection = db.collection<StudentSubmission>('studentSubmissions');

    const submissions = await submissionsCollection
      .find({})
      .sort({ submittedAt: -1 })
      .toArray();

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching student submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
