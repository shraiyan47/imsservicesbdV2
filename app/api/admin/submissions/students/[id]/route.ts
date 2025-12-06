import { getDatabase } from '@/lib/mongodb';
import { StudentSubmission } from '@/models/StudentSubmission';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const db = await getDatabase();
    const submissionsCollection = db.collection<StudentSubmission>('studentSubmissions');

    const result = await submissionsCollection.updateOne(
      { _id: new ObjectId(params.id) as any },
      { $set: body }
    );

    return NextResponse.json({
      message: 'Submission updated',
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    );
  }
}
