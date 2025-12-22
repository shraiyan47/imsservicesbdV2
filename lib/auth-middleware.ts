import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './auth'

export interface AuthRequest extends NextRequest {
  admin?: any
}

export async function verifyAdminAuth(request: NextRequest): Promise<{
  isValid: boolean
  admin?: any
  error?: string
}> {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        isValid: false,
        error: 'Missing or invalid authorization header',
      }
    }

    const token = authHeader.slice(7)

    try {
      const decoded = verifyToken(token)
      return {
        isValid: true,
        admin: decoded,
      }
    } catch (error) {
      return {
        isValid: false,
        error: 'Invalid or expired token',
      }
    }
  } catch (error) {
    return {
      isValid: false,
      error: 'Authentication failed',
    }
  }
}

export function createAuthResponse(
  success: boolean,
  message: string,
  data?: any,
  statusCode: number = 200
) {
  return NextResponse.json(
    {
      success,
      message,
      ...(data && { data }),
    },
    { status: statusCode }
  )
}

export function createErrorResponse(message: string, statusCode: number = 400) {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status: statusCode }
  )
}
