import { NextRequest } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { generateRandomToken, validateEmail } from '@/lib/auth-server'
import {
  createAuthResponse,
  createErrorResponse,
} from '@/lib/auth-middleware'
import { sendEmail, getEmailTemplate, generateVerificationLink } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return createErrorResponse('Email is required', 400)
    }

    if (!validateEmail(email)) {
      return createErrorResponse('Invalid email format', 400)
    }

    const db = await getDatabase()
    const adminUsersCollection = db.collection('admin_users')

    // Find user by email
    const user = await adminUsersCollection.findOne({ email })

    // Always return success to prevent email enumeration
    if (!user) {
      return createAuthResponse(
        true,
        'If an account exists with this email, a password reset link will be sent.',
        {},
        200
      )
    }

    // Generate reset token
    const resetPasswordToken = generateRandomToken()
    const resetPasswordTokenExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Update user with reset token
    await adminUsersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordToken,
          resetPasswordTokenExpires,
          updatedAt: new Date(),
        },
      }
    )

    // Send reset password email
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const resetLink = generateVerificationLink(
      baseUrl,
      resetPasswordToken,
      'reset'
    )

    const emailTemplate = getEmailTemplate('password-reset', { resetLink })

    try {
      await sendEmail({
        to: email,
        subject: 'Reset Your Password - IMS Services',
        html: emailTemplate,
      })
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
    }

    return createAuthResponse(
      true,
      'If an account exists with this email, a password reset link will be sent.',
      {},
      200
    )
  } catch (error) {
    console.error('Forgot password error:', error)
    return createErrorResponse('Forgot password request failed', 500)
  }
}
