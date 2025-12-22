'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Edit2 } from 'lucide-react'
import { fetchWithAuth } from '@/lib/api-client'

interface Partner {
  _id: string
  name: string
  logo: string
}

export default function ManagePartners() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
  })

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    try {
      const res = await fetchWithAuth('/api/admin/partners')
      const data = await res.json()
      setPartners(data)
    } catch (error) {
      console.error('Error fetching partners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await fetchWithAuth(`/api/admin/partners/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
      } else {
        await fetchWithAuth('/api/admin/partners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
      }
      fetchPartners()
      setFormData({ name: '', logo: '' })
      setEditingId(null)
    } catch (error) {
      console.error('Error saving partner:', error)
    }
  }

  const handleEdit = (partner: Partner) => {
    setFormData(partner)
    setEditingId(partner._id)
  }

  const handleDelete = async (id: string) => {
    try {
      if (confirm('Are you sure you want to delete this partner?')) {
        await fetchWithAuth(`/api/admin/partners/${id}`, { method: 'DELETE' })
        fetchPartners()
      }
    } catch (error) {
      console.error('Error deleting partner:', error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Partners</h1>
        <p className="text-gray-600 mt-2">Add, edit, or delete partner universities</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Edit Partner' : 'Add New Partner'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Partner Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Logo URL"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <div className="flex gap-2">
              <Button type="submit" className="bg-purple-600 text-white">
                {editingId ? 'Update Partner' : 'Add Partner'}
              </Button>
              {editingId && (
                <Button 
                  type="button" 
                  onClick={() => {
                    setEditingId(null)
                    setFormData({ name: '', logo: '' })
                  }}
                  className="bg-gray-600 text-white"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {partners.map((partner) => (
          <Card key={partner._id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img 
                    src={partner.logo || "/placeholder.svg"} 
                    alt={partner.name}
                    className="h-12 w-12 object-contain"
                  />
                  <h3 className="font-semibold">{partner.name}</h3>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(partner)}
                    className="bg-blue-600 text-white p-2"
                    size="sm"
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    onClick={() => handleDelete(partner._id)}
                    className="bg-red-600 text-white p-2"
                    size="sm"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
