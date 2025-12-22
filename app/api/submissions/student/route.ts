import { getDatabase } from '@/lib/mongodb';
import { StudentSubmission } from '@/models/StudentSubmission';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, getEmailTemplate } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await connectDB();
    const submissionsCollection = db.collection<StudentSubmission>('studentSubmissions');

    const submission: StudentSubmission = {
      ...body,
      submittedAt: new Date(),
      read: false,
    };

    const result = await submissionsCollection.insertOne(submission);

    // Send confirmation email to student
    if (body.email) {
      try {
        const emailTemplate = getEmailTemplate('student-submission', {
          name: body.name,
          email: body.email,
          phone: body.phone,
          university: body.university || 'Not specified',
        });

        await sendEmail({
          to: body.email,
          subject: 'Application Received - IMS Services',
          html: emailTemplate,
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the submission if email fails
      }
    }

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
