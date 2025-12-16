'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Users, Globe, Star, Building, FileText, Info, BookOpen } from 'lucide-react'

export default function ManageContent() {
  const items = [
    {
      title: 'Services',
      description: 'Manage the services offered by IMS',
      icon: FileText,
      href: '/admin/manage/services',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Countries',
      description: 'Add or edit destination countries',
      icon: Globe,
      href: '/admin/manage/countries',
      color: 'bg-green-50 border-green-200'
    },
    {
      title: 'Universities',
      description: 'Manage university listings and details',
      icon: Building,
      href: '/admin/manage/universities',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      title: 'Blogs',
      description: 'Create and manage SEO-optimized blog posts',
      icon: BookOpen,
      href: '/admin/manage/blogs',
      color: 'bg-cyan-50 border-cyan-200'
    },
    {
      title: 'Testimonials',
      description: 'Add student success stories',
      icon: Star,
      href: '/admin/manage/testimonials',
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      title: 'Partners',
      description: 'Manage partner university logos',
      icon: Building,
      href: '/admin/manage/partners',
      color: 'bg-pink-50 border-pink-200'
    },
    {
      title: 'Company Info',
      description: 'Update contact details and address',
      icon: Info,
      href: '/admin/manage/company-info',
      color: 'bg-orange-50 border-orange-200'
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Content</h1>
        <p className="text-gray-600 mt-2">Update all content on the landing page</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <Card className={`${item.color} border p-6 hover:shadow-lg transition cursor-pointer h-full`}>
                <div className="flex items-start gap-4">
                  <Icon className="w-8 h-8 text-gray-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
