import { NextRequest } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { verifyPassword, generateToken, getClientIp } from '@/lib/auth-server'
import {
  createAuthResponse,
  createErrorResponse,
} from '@/lib/auth-middleware'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return createErrorResponse('Email and password are required', 400)
    }

    const db = await getDatabase()
    const adminUsersCollection = db.collection('admin_users')
    const loginLogsCollection = db.collection('login_logs')

    // Find user by email
    const user = await adminUsersCollection.findOne({ email })

    const ipAddress = getClientIp(request)

    // Check if user exists
    if (!user) {
      // Log failed login attempt
      await loginLogsCollection.insertOne({
        email,
        timestamp: new Date(),
        ipAddress,
        userAgent: request.headers.get('user-agent'),
        success: false,
        reason: 'User not found',
      })

      return createErrorResponse('Invalid email or password', 401)
    }

    // Check if user is verified
    if (!user.isVerified) {
      await loginLogsCollection.insertOne({
        adminId: user._id.toString(),
        email,
        timestamp: new Date(),
        ipAddress,
        userAgent: request.headers.get('user-agent'),
        success: false,
        reason: 'Email not verified',
      })

      return createErrorResponse('Please verify your email first', 401)
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password)

    if (!isPasswordValid) {
      // Log failed login attempt
      await loginLogsCollection.insertOne({
        adminId: user._id.toString(),
        email,
        timestamp: new Date(),
        ipAddress,
        userAgent: request.headers.get('user-agent'),
        success: false,
        reason: 'Invalid password',
      })

      return createErrorResponse('Invalid email or password', 401)
    }

    // Generate JWT token
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    })

    // Update last login and log successful login
    await adminUsersCollection.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    )

    await loginLogsCollection.insertOne({
      adminId: user._id.toString(),
      email,
      timestamp: new Date(),
      ipAddress,
      userAgent: request.headers.get('user-agent'),
      success: true,
    })

    return createAuthResponse(
      true,
      'Login successful',
      {
        token,
        admin: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      200
    )
  } catch (error) {
    console.error('Login error:', error)
    return createErrorResponse('Login failed', 500)
  }
}
