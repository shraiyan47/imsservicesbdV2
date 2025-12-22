'use client';

import { ContactSubmission } from '@/models/ContactSubmission';
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/api-client';

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetchWithAuth('/api/admin/submissions/contact');
      const data = await response.json();
      setSubmissions(data);
      if (data.length > 0) {
        setSelectedSubmission(data[0]);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetchWithAuth(`/api/admin/submissions/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      });
      fetchSubmissions();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
        <p className="text-gray-600 mt-1">
          {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-y-auto max-h-[600px]">
          {submissions.map((submission) => (
            <button
              key={submission._id}
              onClick={() => {
                setSelectedSubmission(submission);
                markAsRead(submission._id as string);
              }}
              className={`w-full text-left p-4 border-b transition ${
                selectedSubmission?._id === submission._id
                  ? 'bg-purple-50 border-l-4 border-l-purple-600'
                  : 'hover:bg-gray-50'
              } ${!submission.read && 'font-semibold bg-yellow-50'}`}
            >
              <p className="font-semibold text-gray-900">{submission.name}</p>
              <p className="text-sm text-gray-600">{submission.email}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(submission.submittedAt).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          {selectedSubmission ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedSubmission.name}</h2>
                <p className="text-sm text-gray-600 mt-1">{selectedSubmission.subject}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <a
                    href={`mailto:${selectedSubmission.email}`}
                    className="font-semibold text-purple-600 hover:underline"
                  >
                    {selectedSubmission.email}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <a
                    href={`tel:${selectedSubmission.phone}`}
                    className="font-semibold text-purple-600 hover:underline"
                  >
                    {selectedSubmission.phone}
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">Message</p>
                <p className="text-gray-900 leading-relaxed">{selectedSubmission.message}</p>
              </div>

              <div className="pt-4 border-t text-sm text-gray-600">
                Submitted: {new Date(selectedSubmission.submittedAt).toLocaleString()}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No submission selected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
