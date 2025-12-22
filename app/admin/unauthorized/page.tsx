'use client'

import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 text-center">
        {/* Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Not Authenticated</h1>
        <p className="text-gray-600 mb-6">
          You need to be logged in to access the admin panel. Please log in with your credentials.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/admin/login"
            className="block w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Go to Login
          </Link>
          <Link
            href="/"
            className="block w-full border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Back to Home
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">
            Don't have an account?
          </p>
          <p className="text-xs text-gray-500">
            Contact your administrator to create an admin account.
          </p>
        </div>
      </div>
    </div>
  )
}
