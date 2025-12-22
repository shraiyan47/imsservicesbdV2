import { NextRequest } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import {
  createAuthResponse,
  createErrorResponse,
} from '@/lib/auth-middleware'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return createErrorResponse('Verification token is required', 400)
    }

    const db = await getDatabase()
    const adminUsersCollection = db.collection('admin_users')

    // Find user with valid verification token
    const user = await adminUsersCollection.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() },
    })

    if (!user) {
      return createErrorResponse(
        'Invalid or expired verification token',
        400
      )
    }

    // Update user as verified
    await adminUsersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          isVerified: true,
          updatedAt: new Date(),
        },
        $unset: {
          verificationToken: '',
          verificationTokenExpires: '',
        },
      }
    )

    return createAuthResponse(true, 'Email verified successfully!')
  } catch (error) {
    console.error('Email verification error:', error)
    return createErrorResponse('Email verification failed', 500)
  }
}
