'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/client-auth'

interface ProtectedPageProps {
  children: ReactNode
}

export default function ProtectedPage({ children }: ProtectedPageProps) {
  const router = useRouter()

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.replace('/admin/login')
    }
  }, [router])

  if (!isAdminAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
