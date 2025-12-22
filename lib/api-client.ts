// Client-side API utility for authenticated requests

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem('adminToken')
  
  if (!token) {
    // Token not available, redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login'
    }
    throw new Error('No authentication token')
  }

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // If unauthorized, redirect to login
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login'
    }
    throw new Error('Unauthorized')
  }

  return response
}
