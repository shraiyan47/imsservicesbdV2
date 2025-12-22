'use client';

import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/api-client';

interface DashboardStats {
  totalStudents: number;
  totalContacts: number;
  unreadStudents: number;
  unreadContacts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalContacts: 0,
    unreadStudents: 0,
    unreadContacts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, contactsRes] = await Promise.all([
          fetchWithAuth('/api/admin/submissions/students'),
          fetchWithAuth('/api/admin/submissions/contact'),
        ]);

        const students = await studentsRes.json();
        const contacts = await contactsRes.json();

        setStats({
          totalStudents: students.length,
          totalContacts: contacts.length,
          unreadStudents: students.filter((s: any) => !s.read).length,
          unreadContacts: contacts.filter((c: any) => !c.read).length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: number;
    icon: string;
  }) => (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to IMS Services Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Student Submissions" value={stats.totalStudents} icon="👨‍🎓" />
        <StatCard label="Unread Student Forms" value={stats.unreadStudents} icon="🔔" />
        <StatCard label="Total Contact Messages" value={stats.totalContacts} icon="📧" />
        <StatCard label="Unread Contacts" value={stats.unreadContacts} icon="📮" />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/admin/submissions/students"
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition border border-blue-200 text-center"
          >
            <p className="font-semibold text-blue-900">View Student Submissions</p>
            <p className="text-sm text-blue-700 mt-1">Review new student inquiries</p>
          </a>
          <a
            href="/admin/submissions/contact"
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition border border-green-200 text-center"
          >
            <p className="font-semibold text-green-900">View Contact Messages</p>
            <p className="text-sm text-green-700 mt-1">Review contact form submissions</p>
          </a>
          <a
            href="/admin/manage/universities"
            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition border border-purple-200 text-center"
          >
            <p className="font-semibold text-purple-900">Manage Universities</p>
            <p className="text-sm text-purple-700 mt-1">Add, edit, or delete universities</p>
          </a>
          <a
            href="/admin/manage/company-info"
            className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition border border-orange-200 text-center"
          >
            <p className="font-semibold text-orange-900">Company Information</p>
            <p className="text-sm text-orange-700 mt-1">Update company details and contact info</p>
          </a>
        </div>
      </div>
    </div>
  );
}
