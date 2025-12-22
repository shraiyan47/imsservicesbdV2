// Client-side auth utilities
export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('adminToken')
}

export function getAdminUser() {
  if (typeof window === 'undefined') return null
  const user = localStorage.getItem('adminUser')
  return user ? JSON.parse(user) : null
}

export function setAdminAuth(token: string, user: any) {
  localStorage.setItem('adminToken', token)
  localStorage.setItem('adminUser', JSON.stringify(user))
  // Also set cookie for middleware
  if (typeof window !== 'undefined') {
    document.cookie = `adminToken=${token}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax`
  }
}

export function clearAdminAuth() {
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminUser')
  // Clear cookie
  if (typeof window !== 'undefined') {
    document.cookie = 'adminToken=; path=/; max-age=0; SameSite=Lax'
  }
}

export function isAdminAuthenticated(): boolean {
  return !!getAdminToken()
}
