import { NextRequest } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import {
  hashPassword,
  validateEmail,
  validatePassword,
  generateRandomToken,
} from '@/lib/auth-server'
import {
  createAuthResponse,
  createErrorResponse,
} from '@/lib/auth-middleware'
import { sendEmail, getEmailTemplate, generateVerificationLink } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return createErrorResponse('Missing required fields', 400)
    }

    if (!validateEmail(email)) {
      return createErrorResponse('Invalid email format', 400)
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

    // Check if user already exists
    const existingUser = await adminUsersCollection.findOne({ email })
    if (existingUser) {
      return createErrorResponse('Email already registered', 409)
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Generate verification token
    const verificationToken = generateRandomToken()
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create new user
    const result = await adminUsersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      role: 'editor',
      permissions: [],
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Send verification email
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const verificationLink = generateVerificationLink(
      baseUrl,
      verificationToken,
      'verify'
    )

    const emailTemplate = getEmailTemplate('verify-email', { verificationLink })

    try {
      await sendEmail({
        to: email,
        subject: 'Verify Your Email - IMS Services',
        html: emailTemplate,
      })
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Still allow registration but email sending failed
      return createAuthResponse(
        true,
        'Registration successful. Please check your email to verify your account. If you do not receive the email, it may take a few minutes.',
        { userId: result.insertedId },
        201
      )
    }

    return createAuthResponse(
      true,
      'Registration successful. Please check your email to verify your account.',
      { userId: result.insertedId },
      201
    )
  } catch (error) {
    console.error('Registration error:', error)
    return createErrorResponse('Registration failed', 500)
  }
}
