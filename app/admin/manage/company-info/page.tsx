'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { fetchWithAuth } from '@/lib/api-client'

interface CompanyInfo {
  phone: string
  email: string
  address: string
  facebookUrl: string
  whatsappUrl: string
}

export default function ManageCompanyInfo() {
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<CompanyInfo>({
    phone: '',
    email: '',
    address: '',
    facebookUrl: '',
    whatsappUrl: '',
  })

  useEffect(() => {
    fetchCompanyInfo()
  }, [])

  const fetchCompanyInfo = async () => {
    try {
      const res = await fetchWithAuth('/api/admin/company-info')
      const data = await res.json()
      if (data) {
        setFormData(data)
      }
    } catch (error) {
      console.error('Error fetching company info:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetchWithAuth('/api/admin/company-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      alert('Company info updated successfully')
    } catch (error) {
      console.error('Error saving company info:', error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Company Information</h1>
        <p className="text-gray-600 mt-2">Update your company details and contact information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Facebook URL</label>
              <input
                type="url"
                value={formData.facebookUrl}
                onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">WhatsApp URL</label>
              <input
                type="url"
                value={formData.whatsappUrl}
                onChange={(e) => setFormData({ ...formData, whatsappUrl: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <Button type="submit" className="bg-purple-600 text-white mt-6">
              Save Company Information
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
