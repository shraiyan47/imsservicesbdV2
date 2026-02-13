import { getDatabase } from '@/lib/mongodb';
import { ContactSubmission } from '@/models/ContactSubmission';
import { NextRequest, NextResponse } from 'next/server';

// Validation schema for contact submissions
const ALLOWED_FIELDS = ['name', 'message', 'phone'];
const MAX_STRING_LENGTH = 1000;
const MAX_NAME_LENGTH = 100;

function validateContactSubmission(body: unknown): ContactSubmission {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid request body');
  }

  const obj = body as Record<string, unknown>;
  const validated: Partial<ContactSubmission> = {};

  // Validate allowed fields only
  for (const field of ALLOWED_FIELDS) {
    if (field in obj) {
      const value = obj[field];

      if (typeof value !== 'string') {
        throw new Error(`Field ${field} must be a string`);
      }

      const trimmed = value.trim();

      // Length validation
      if (field === 'name' && trimmed.length > MAX_NAME_LENGTH) {
        throw new Error(`${field} exceeds maximum length`);
      }
      if (trimmed.length > MAX_STRING_LENGTH) {
        throw new Error(`${field} exceeds maximum length`);
      }

      // Phone number validation
      if (field === 'phone') {
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
        if (!phoneRegex.test(trimmed)) {
          throw new Error('Invalid phone number format');
        }
      }

      (validated as Record<string, string>)[field] = trimmed;
    }
  }

  // Ensure required fields
  if (!validated.name || !validated.message) {
    throw new Error('Missing required fields: name, message');
  }

  return validated as ContactSubmission;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = validateContactSubmission(body);

    const db = await getDatabase();
    const contactCollection = db.collection<ContactSubmission>('contactSubmissions');

    const submission: ContactSubmission = {
      ...validated,
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
      { error: error instanceof Error ? error.message : 'Failed to submit form' },
      { status: 400 }
    );
  }
}
