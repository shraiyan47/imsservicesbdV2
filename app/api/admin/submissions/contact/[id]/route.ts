import { getDatabase } from '@/lib/mongodb';
import { ContactSubmission } from '@/models/ContactSubmission';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const db = await getDatabase();
    const contactCollection = db.collection<ContactSubmission>('contactSubmissions');

    const result = await contactCollection.updateOne( 
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
