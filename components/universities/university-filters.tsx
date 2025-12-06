'use client';

import { useState } from 'react';

export interface FilterState {
  minPrice?: number;
  maxPrice?: number;
  subject?: string;
  minIelts?: number;
  minDuolingo?: number;
}

interface UniversityFiltersProps {
  subjects: string[];
  onFilterChange: (filters: FilterState) => void;
}

export default function UniversityFilters({
  subjects,
  onFilterChange,
}: UniversityFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({});

  const handleChange = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">Filters</h3>

      {/* Price Range */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Price Range (USD)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) =>
              handleChange({ minPrice: e.target.value ? parseInt(e.target.value) : undefined })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) =>
              handleChange({ maxPrice: e.target.value ? parseInt(e.target.value) : undefined })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Subject */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Subject
        </label>
        <select
          value={filters.subject || ''}
          onChange={(e) => handleChange({ subject: e.target.value || undefined })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Subjects</option>
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      {/* IELTS Score */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Min IELTS Score
        </label>
        <input
          type="number"
          step="0.5"
          placeholder="e.g., 6.0"
          value={filters.minIelts || ''}
          onChange={(e) =>
            handleChange({ minIelts: e.target.value ? parseFloat(e.target.value) : undefined })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Duolingo Score */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Min Duolingo Score
        </label>
        <input
          type="number"
          placeholder="e.g., 100"
          value={filters.minDuolingo || ''}
          onChange={(e) =>
            handleChange({
              minDuolingo: e.target.value ? parseFloat(e.target.value) : undefined,
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Clear Filters */}
      {Object.keys(filters).length > 0 && (
        <button
          onClick={() => {
            setFilters({});
            onFilterChange({});
          }}
          className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
