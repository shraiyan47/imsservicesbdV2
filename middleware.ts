import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to public admin pages without authentication
  if (pathname === '/admin/login' || pathname === '/admin/unauthorized' || pathname === '/admin/register') {
    return NextResponse.next()
  }

  // Only protect admin and API admin routes
  // if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
  //   const authHeader = request.headers.get('authorization')

  //   // For page routes, check if user has token in cookies or redirect to login
  //   if (pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
  //     // This is a page route, let the page handle auth check
  //     // Or redirect based on cookie if available
  //     const token = request.cookies.get('adminToken')?.value

  //     console.log("Middleware token check:" + token);

  //     if (!token) {
  //       const loginUrl = new URL('/admin/login', request.url)
  //       return NextResponse.redirect(loginUrl)
  //     }

  //     try {
  //       verifyToken(token)
  //       return NextResponse.next()
  //     } catch (error) {
  //       const loginUrl = new URL('/admin/login', request.url)
  //       return NextResponse.redirect(loginUrl)
  //     }
  //   }

  //   // For API routes, check authorization header
  //   if (pathname.startsWith('/api/admin')) {
  //     if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //       return NextResponse.json(
  //         { success: false, message: 'Missing authorization header' },
  //         { status: 401 }
  //       )
  //     }

  //     const token = authHeader.slice(7)

  //     try {
  //       verifyToken(token)
  //       return NextResponse.next()
  //     } catch (error) {
  //       return NextResponse.json(
  //         { success: false, message: 'Invalid or expired token' },
  //         { status: 401 }
  //       )
  //     }
  //   }
  // }

  // Don't block landing page APIs
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
