'use client'

import { useState, useEffect } from 'react'
import { University } from '@/models/University'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import RichTextEditor from '@/components/ui/rich-text-editor'
import { fetchWithAuth } from '@/lib/api-client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Edit, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'

const initialFormState = {
  name: '',
  country: '',
  image: '',
  description: '',
  website: '',
  subjects: '' as any,
  priceRange: {
    min: 0,
    max: 0,
    currency: 'USD',
  },
  requirements: {
    ielts: undefined as number | undefined,
    duolingo: undefined as number | undefined,
    toefl: undefined as number | undefined,
    gre: undefined as number | undefined,
  },
  acceptanceRate: undefined as number | undefined,
  ranking: undefined as number | undefined,
  featuredPrograms: '' as any,
  order: 0,
}

export default function UniversitiesManage() {
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState(initialFormState)

  useEffect(() => {
    fetchUniversities()
  }, [])

  const fetchUniversities = async () => {
    try {
      setLoading(true)
      const res = await fetchWithAuth('/api/admin/universities')
      const data = await res.json()
      setUniversities(data)
    } catch (error) {
      console.error('Error fetching universities:', error)
      toast.error('Failed to fetch universities')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    const value = e.target.value
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof typeof formData],
          [child]: isNaN(Number(value)) ? value : Number(value),
        },
      })
    } else {
      setFormData({
        ...formData,
        [field]: isNaN(Number(value)) ? value : field === 'order' ? Number(value) : value,
      })
    }
  }

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value.split(',').map((item) => item.trim())
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.country || !formData.image || !formData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const payload = {
        ...formData,
        subjects: Array.isArray(formData.subjects) ? formData.subjects : [],
        featuredPrograms: Array.isArray(formData.featuredPrograms) ? formData.featuredPrograms : [],
      }

      if (editingId) {
        const res = await fetchWithAuth('/api/admin/universities', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: editingId, ...payload }),
        })
        if (!res.ok) throw new Error('Failed to update')
        toast.success('University updated successfully')
      } else {
        const res = await fetchWithAuth('/api/admin/universities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Failed to create')
        toast.success('University created successfully')
      }

      setOpen(false)
      setEditingId(null)
      setFormData(initialFormState)
      fetchUniversities()
    } catch (error) {
      console.error('Error saving university:', error)
      toast.error(editingId ? 'Failed to update university' : 'Failed to create university')
    }
  }

  const handleEdit = (university: University) => {
    setFormData({
      ...initialFormState,
      ...university,
      website: university.website || '',
      subjects: typeof university.subjects === 'string' ? university.subjects : university.subjects?.join(', ') || '',
      featuredPrograms: typeof university.featuredPrograms === 'string' ? university.featuredPrograms : university.featuredPrograms?.join(', ') || '',
      requirements: {
        ielts: university.requirements?.ielts,
        duolingo: university.requirements?.duolingo,
        toefl: university.requirements?.toefl,
        gre: university.requirements?.gre,
      },
      acceptanceRate: university.acceptanceRate,
      ranking: university.ranking,
    })
    setEditingId(university._id || null)
    setOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const res = await fetchWithAuth('/api/admin/universities', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: deleteId }),
      })
      if (!res.ok) throw new Error('Failed to delete')
      toast.success('University deleted successfully')
      setDeleteId(null)
      fetchUniversities()
    } catch (error) {
      console.error('Error deleting university:', error)
      toast.error('Failed to delete university')
    }
  }

  const closeDialog = () => {
    setOpen(false)
    setEditingId(null)
    setFormData(initialFormState)
  }

  if (loading) {
    return <div className="text-center py-12">Loading universities...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Universities</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingId(null)
                setFormData(initialFormState)
              }}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add University
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit University' : 'Add New University'}</DialogTitle>
              <DialogDescription>
                {editingId ? 'Update university information' : 'Add a new university to the listing'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">University Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange(e, 'name')}
                    placeholder="e.g., Oxford University"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country *</label>
                  <Input
                    value={formData.country}
                    onChange={(e) => handleInputChange(e, 'country')}
                    placeholder="e.g., United Kingdom"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image URL *</label>
                <Input
                  value={formData.image}
                  onChange={(e) => handleInputChange(e, 'image')}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Website</label>
                <Input
                  value={formData.website}
                  onChange={(e) => handleInputChange(e, 'website')}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(value) => {
                    setFormData(prev => ({ ...prev, description: value }))
                  }}
                  placeholder="University description (supports Markdown formatting)..."
                  minHeight={250}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subjects (comma-separated)</label>
                <Input
                  value={formData.subjects}
                  onChange={(e) => handleArrayChange(e, 'subjects')}
                  placeholder="Engineering, Business, Medicine"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Min Price *</label>
                  <Input
                    type="number"
                    value={formData.priceRange.min}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priceRange: { ...formData.priceRange, min: Number(e.target.value) },
                      })
                    }
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Price *</label>
                  <Input
                    type="number"
                    value={formData.priceRange.max}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priceRange: { ...formData.priceRange, max: Number(e.target.value) },
                      })
                    }
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Currency</label>
                  <Input
                    value={formData.priceRange.currency}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priceRange: { ...formData.priceRange, currency: e.target.value },
                      })
                    }
                    placeholder="USD"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">IELTS Requirement</label>
                  <Input
                    type="number"
                    step="0.5"
                    value={formData.requirements.ielts || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requirements: {
                          ...formData.requirements,
                          ielts: e.target.value ? Number(e.target.value) : undefined,
                        },
                      })
                    }
                    placeholder="6.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duolingo Requirement</label>
                  <Input
                    type="number"
                    value={formData.requirements.duolingo || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requirements: {
                          ...formData.requirements,
                          duolingo: e.target.value ? Number(e.target.value) : undefined,
                        },
                      })
                    }
                    placeholder="110"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">TOEFL Requirement</label>
                  <Input
                    type="number"
                    value={formData.requirements.toefl || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requirements: {
                          ...formData.requirements,
                          toefl: e.target.value ? Number(e.target.value) : undefined,
                        },
                      })
                    }
                    placeholder="90"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">GRE Requirement</label>
                  <Input
                    type="number"
                    value={formData.requirements.gre || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requirements: {
                          ...formData.requirements,
                          gre: e.target.value ? Number(e.target.value) : undefined,
                        },
                      })
                    }
                    placeholder="320"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Acceptance Rate (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.acceptanceRate || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        acceptanceRate: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="15"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ranking</label>
                  <Input
                    type="number"
                    value={formData.ranking || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ranking: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Featured Programs (comma-separated)</label>
                <Input
                  value={formData.featuredPrograms}
                  onChange={(e) => handleArrayChange(e, 'featuredPrograms')}
                  placeholder="Computer Science, Business Administration"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Display Order *</label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => handleInputChange(e, 'order')}
                  placeholder="0"
                  required
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit">{editingId ? 'Update' : 'Create'} University</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Price Range</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {universities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No universities found
                </TableCell>
              </TableRow>
            ) : (
              universities.map((uni) => (
                <TableRow key={uni._id}>
                  <TableCell className="font-medium">{uni.name}</TableCell>
                  <TableCell>{uni.country}</TableCell>
                  <TableCell>
                    {uni.priceRange.min} - {uni.priceRange.max} {uni.priceRange.currency}
                  </TableCell>
                  <TableCell>{uni.order}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(uni)}
                        className="gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeleteId(uni._id || null)}
                            className="gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete University</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {uni.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="flex gap-2 justify-end">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
                              Delete
                            </AlertDialogAction>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
