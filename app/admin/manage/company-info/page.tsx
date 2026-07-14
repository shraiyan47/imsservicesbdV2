'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { fetchWithAuth } from '@/lib/api-client'

interface CompanyInfo {
  phone: string
  whatsappUrl: string
  facebookUrl: string
  email: string
  city: string
  country: string
  postalCode: string
  address: string
  googleMapLocation: string
}

export default function ManageCompanyInfo() {
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<CompanyInfo>({
    phone: '',
    whatsappUrl: '',
    facebookUrl: '',
    email: '',
    city: '',
    country: '',
    postalCode: '',
    address: '',
    googleMapLocation: '',
  })

  useEffect(() => {
    fetchCompanyInfo()
  }, [])

  const fetchCompanyInfo = async () => {
    try {
      const res = await fetchWithAuth('/api/admin/company-info')
      const data = await res.json()
      if (data) {
        setFormData((prev) => ({
          ...prev,
          ...data,
        }))
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
              <label className="block text-sm font-medium mb-1">WhatsApp URL</label>
              <input
                type="url"
                value={formData.whatsappUrl}
                onChange={(e) => setFormData({ ...formData, whatsappUrl: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
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
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Postal Code</label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Office Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Google Map Location</label>
              <input
                type="text"
                value={formData.googleMapLocation}
                onChange={(e) => setFormData({ ...formData, googleMapLocation: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter Google Maps URL or embed identifier"
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
