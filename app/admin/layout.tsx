'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: '📊' },
    { label: 'Student Submissions', href: '/admin/submissions/students', icon: '👨‍🎓' },
    { label: 'Contact Submissions', href: '/admin/submissions/contact', icon: '📧' },
    { label: 'Manage Services', href: '/admin/manage/services', icon: '🔧' },
    { label: 'Manage Countries', href: '/admin/manage/countries', icon: '🌍' },
    { label: 'Manage Universities', href: '/admin/manage/universities', icon: '🏫' },
    { label: 'Manage Testimonials', href: '/admin/manage/testimonials', icon: '⭐' },
    { label: 'Manage Partners', href: '/admin/manage/partners', icon: '🤝' },
    { label: 'Company Info', href: '/admin/manage/company-info', icon: '🏢' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-6 border-b border-gray-700">
          <h1 className={`font-bold text-xl ${!sidebarOpen && 'text-center'}`}>
            {sidebarOpen ? 'IMS Admin' : 'IA'}
          </h1>
        </div>

        <nav className="mt-8 space-y-2 px-3">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition text-sm font-medium"
              title={!sidebarOpen ? item.label : undefined}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 hover:text-gray-900"
          >
            ☰
          </button>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Back to Site
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  );
}
