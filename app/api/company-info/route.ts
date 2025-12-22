import { getDatabase } from '@/lib/mongodb';
import { CompanyInfo } from '@/models/CompanyInfo';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = await getDatabase();
    const companyInfoCollection = db.collection<CompanyInfo>('company-info');

    const companyInfo = await companyInfoCollection.findOne({});

    if (!companyInfo) {
      return NextResponse.json(
        { error: 'Company info not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(companyInfo);
  } catch (error) {
    console.error('Error fetching company info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company info' },
      { status: 500 }
    );
  }
}
