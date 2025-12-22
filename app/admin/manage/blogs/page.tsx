'use client'

import { useState, useEffect } from 'react'
import { Blog } from '@/models/Blog'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Edit, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'

const initialFormState = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  author: 'IMS Services',
  tags: '' as any,
  metaTags: '' as any,
  metaDescription: '',
  featuredImage: '',
  featured: false,
  order: 0,
  published: true,
}

export default function BlogsManage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState(initialFormState)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const res = await fetchWithAuth('/api/admin/blogs')
      const data = await res.json()
      setBlogs(data)
    } catch (error) {
      console.error('Error fetching blogs:', error)
      toast.error('Failed to fetch blogs')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    const value = e.target.value
    setFormData({
      ...formData,
      [field]: field === 'order' ? (value ? Number(value) : 0) : value,
    })
  }

  const handleCheckChange = (field: string, checked: boolean) => {
    setFormData({
      ...formData,
      [field]: checked,
    })
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

    if (!formData.title || !formData.content || !formData.excerpt || !formData.metaDescription) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const payload = {
        ...formData,
        tags: Array.isArray(formData.tags) ? formData.tags : [],
        metaTags: Array.isArray(formData.metaTags) ? formData.metaTags : [],
      }

      if (editingId) {
        const res = await fetchWithAuth('/api/admin/blogs', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: editingId, ...payload }),
        })
        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.error || 'Failed to update')
        }
        toast.success('Blog updated successfully')
      } else {
        const res = await fetchWithAuth('/api/admin/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.error || 'Failed to create')
        }
        toast.success('Blog created successfully')
      }

      setOpen(false)
      setEditingId(null)
      setFormData(initialFormState)
      fetchBlogs()
    } catch (error) {
      console.error('Error saving blog:', error)
      toast.error(error instanceof Error ? error.message : (editingId ? 'Failed to update blog' : 'Failed to create blog'))
    }
  }

  const handleEdit = (blog: Blog) => {
    setFormData({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt,
      author: blog.author || 'IMS Services',
      tags: typeof blog.tags === 'string' ? blog.tags : blog.tags?.join(', ') || '',
      metaTags: typeof blog.metaTags === 'string' ? blog.metaTags : blog.metaTags?.join(', ') || '',
      metaDescription: blog.metaDescription,
      featuredImage: blog.featuredImage || '',
      featured: blog.featured,
      order: blog.order,
      published: blog.published,
    })
    setEditingId(blog._id || null)
    setOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const res = await fetchWithAuth('/api/admin/blogs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: deleteId }),
      })
      if (!res.ok) throw new Error('Failed to delete')
      toast.success('Blog deleted successfully')
      setDeleteId(null)
      fetchBlogs()
    } catch (error) {
      console.error('Error deleting blog:', error)
      toast.error('Failed to delete blog')
    }
  }

  const closeDialog = () => {
    setOpen(false)
    setEditingId(null)
    setFormData(initialFormState)
  }

  if (loading) {
    return <div className="text-center py-12">Loading blogs...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Blogs</h1>
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
              Add Blog
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Blog' : 'Add New Blog'}</DialogTitle>
              <DialogDescription>
                {editingId ? 'Update blog information' : 'Create a new blog post with SEO optimization'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Blog Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange(e, 'title')}
                  placeholder="e.g., Best Universities in UK for Engineering"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Slug (URL friendly)</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => handleInputChange(e, 'slug')}
                  placeholder="e.g., best-universities-uk-engineering"
                  disabled={editingId ? true : false}
                />
                <p className="text-xs text-gray-500 mt-1">Auto-generated from title if not provided</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Excerpt (Short Summary) *</label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange(e, 'excerpt')}
                  placeholder="Brief summary of the blog (60-160 characters recommended)"
                  rows={2}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Used in search results and blog listings</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Meta Description (SEO) *</label>
                <Textarea
                  value={formData.metaDescription}
                  onChange={(e) => handleInputChange(e, 'metaDescription')}
                  placeholder="Meta description for search engines (60-160 characters)"
                  rows={2}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Appears in search engine results</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Blog Content *</label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => {
                    setFormData(prev => ({ ...prev, content: value }))
                  }}
                  placeholder="Full blog content (supports Markdown formatting)..."
                  minHeight={300}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => handleArrayChange(e, 'tags')}
                    placeholder="education, universities, uk"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Meta Tags (comma-separated)</label>
                  <Input
                    value={formData.metaTags}
                    onChange={(e) => handleArrayChange(e, 'metaTags')}
                    placeholder="SEO, meta tags, keywords"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Author</label>
                  <Input
                    value={formData.author}
                    onChange={(e) => handleInputChange(e, 'author')}
                    placeholder="IMS Services"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Featured Image URL</label>
                  <Input
                    value={formData.featuredImage}
                    onChange={(e) => handleInputChange(e, 'featuredImage')}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Display Order</label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => handleInputChange(e, 'order')}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleCheckChange('featured', checked as boolean)}
                  />
                  <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
                    Mark as Featured Blog
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => handleCheckChange('published', checked as boolean)}
                  />
                  <label htmlFor="published" className="text-sm font-medium cursor-pointer">
                    Published (visible to public)
                  </label>
                </div>
              </div>

              <div className="flex gap-2 justify-end border-t pt-4">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit">{editingId ? 'Update' : 'Create'} Blog</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No blogs found
                </TableCell>
              </TableRow>
            ) : (
              blogs.map((blog) => (
                <TableRow key={blog._id}>
                  <TableCell className="font-medium max-w-xs truncate">{blog.title}</TableCell>
                  <TableCell className="text-sm">{blog.slug}</TableCell>
                  <TableCell>{blog.featured ? '✓' : '-'}</TableCell>
                  <TableCell>{blog.published ? '✓' : '-'}</TableCell>
                  <TableCell>{blog.order}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(blog)}
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
                            onClick={() => setDeleteId(blog._id || null)}
                            className="gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Blog</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{blog.title}"? This action cannot be undone.
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
