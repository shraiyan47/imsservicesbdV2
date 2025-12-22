'use client';

import { useState } from 'react';

interface StudentEnrollmentFormProps {
  onClose: () => void;
  countries: string[];
  subjects: string[];
}

export default function StudentEnrollmentForm({
  onClose,
  countries = [],
  subjects = [],
}: StudentEnrollmentFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    destinationCountries: [] as string[],
    subjects: [] as string[],
    qualifications: '',
    ielts: '',
    duolingo: '',
    budget: '',
    additionalInfo: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/submissions/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to submit');

      setMessage('Form submitted successfully! We will contact you soon.');
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      setMessage('Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMultiSelect = (field: 'destinationCountries' | 'subjects', value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full my-4">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 sm:p-6 flex items-center justify-between rounded-t-lg">
          <h2 className="text-xl sm:text-2xl font-bold">Student Enrollment Form</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:opacity-80 transition flex-shrink-0 ml-4"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {message && (
            <div
              className={`p-3 sm:p-4 rounded-lg text-sm sm:text-base ${
                message.includes('successfully')
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="First Name *"
              required
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm sm:text-base"
            />
            <input
              type="text"
              placeholder="Last Name *"
              required
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm sm:text-base"
            />
            <input
              type="email"
              placeholder="Email *"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm sm:text-base"
            />
            <input
              type="tel"
              placeholder="Phone Number *"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Current Country *
            </label>
            <select
              required
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm sm:text-base"
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Destination Countries
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2 sm:p-3 bg-white">
              {countries.map((country) => (
                <label key={country} className="flex items-center gap-2 cursor-pointer text-sm sm:text-base">
                  <input
                    type="checkbox"
                    checked={formData.destinationCountries.includes(country)}
                    onChange={() =>
                      toggleMultiSelect('destinationCountries', country)
                    }
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm">{country}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Subjects of Interest
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2 sm:p-3 bg-white">
              {subjects.map((subject) => (
                <label key={subject} className="flex items-center gap-2 cursor-pointer text-sm sm:text-base">
                  <input
                    type="checkbox"
                    checked={formData.subjects.includes(subject)}
                    onChange={() => toggleMultiSelect('subjects', subject)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm">{subject}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <input
              type="number"
              placeholder="IELTS Score"
              step="0.5"
              value={formData.ielts}
              onChange={(e) => setFormData({ ...formData, ielts: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm sm:text-base"
            />
            <input
              type="number"
              placeholder="Duolingo Score"
              value={formData.duolingo}
              onChange={(e) =>
                setFormData({ ...formData, duolingo: e.target.value })
              }
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm sm:text-base"
            />
            <input
              type="number"
              placeholder="Budget (USD)"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm sm:text-base"
            />
          </div>

          <textarea
            placeholder="Additional Information"
            rows={3}
            value={formData.additionalInfo}
            onChange={(e) =>
              setFormData({ ...formData, additionalInfo: e.target.value })
            }
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm sm:text-base"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 text-sm sm:text-base"
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
