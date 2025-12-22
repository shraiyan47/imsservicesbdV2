import { NextRequest } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { hashPassword, validatePassword } from '@/lib/auth-server'
import {
  createAuthResponse,
  createErrorResponse,
} from '@/lib/auth-middleware'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return createErrorResponse('Token and password are required', 400)
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return createErrorResponse(
        `Password validation failed: ${passwordValidation.errors.join(', ')}`,
        400
      )
    }

    const db = await getDatabase()
    const adminUsersCollection = db.collection('admin_users')

    // Find user with valid reset token
    const user = await adminUsersCollection.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpires: { $gt: new Date() },
    })

    if (!user) {
      return createErrorResponse(
        'Invalid or expired password reset token',
        400
      )
    }

    // Hash new password
    const hashedPassword = await hashPassword(password)

    // Update user password and remove reset token
    await adminUsersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
        $unset: {
          resetPasswordToken: '',
          resetPasswordTokenExpires: '',
        },
      }
    )

    return createAuthResponse(true, 'Password reset successful. Please login with your new password.')
  } catch (error) {
    console.error('Reset password error:', error)
    return createErrorResponse('Password reset failed', 500)
  }
}
