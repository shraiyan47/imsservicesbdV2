'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Edit2, Star } from 'lucide-react'

interface Testimonial {
  _id: string
  name: string
  country: string
  university: string
  comment: string
  rating: number
}

export default function ManageTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    university: '',
    comment: '',
    rating: 5,
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/admin/testimonials')
      const data = await res.json()
      setTestimonials(data)
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await fetch(`/api/admin/testimonials/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
      } else {
        await fetch('/api/admin/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
      }
      fetchTestimonials()
      setFormData({ name: '', country: '', university: '', comment: '', rating: 5 })
      setEditingId(null)
    } catch (error) {
      console.error('Error saving testimonial:', error)
    }
  }

  const handleEdit = (testimonial: Testimonial) => {
    setFormData(testimonial)
    setEditingId(testimonial._id)
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' })
      fetchTestimonials()
    } catch (error) {
      console.error('Error deleting testimonial:', error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Testimonials</h1>
        <p className="text-gray-600 mt-2">Add, edit, or delete student success stories</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Edit Testimonial' : 'Add New Testimonial'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Student Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="University"
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
            <textarea
              placeholder="Testimonial Comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              rows={4}
              required
            />
            <select
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num} Stars</option>
              ))}
            </select>
            <div className="flex gap-2">
              <Button type="submit" className="bg-purple-600 text-white">
                {editingId ? 'Update Testimonial' : 'Add Testimonial'}
              </Button>
              {editingId && (
                <Button 
                  type="button" 
                  onClick={() => {
                    setEditingId(null)
                    setFormData({ name: '', country: '', university: '', comment: '', rating: 5 })
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
        {testimonials.map((testimonial) => (
          <Card key={testimonial._id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic mb-3">"{testimonial.comment}"</p>
                  <div className="text-sm">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-gray-600">{testimonial.country} • {testimonial.university}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(testimonial)}
                    className="bg-blue-600 text-white p-2"
                    size="sm"
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    onClick={() => handleDelete(testimonial._id)}
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
