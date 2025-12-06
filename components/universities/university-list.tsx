'use client';

import { University } from '@/models/University';
import Image from 'next/image';

interface UniversityListProps {
  universities: University[];
  selectedId?: string;
  onSelect: (university: University) => void;
}

export default function UniversityList({
  universities,
  selectedId,
  onSelect,
}: UniversityListProps) {
  return (
    <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
      {universities.map((university) => (
        <button
          key={university._id}
          onClick={() => onSelect(university)}
          className={`w-full text-left p-4 rounded-lg border-2 transition ${
            selectedId === university._id
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-200 bg-white hover:border-purple-300'
          }`}
        >
          <div className="flex gap-3">
            <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
              <Image
                src={university.image || '/placeholder.svg?height=64&width=64&query=university'}
                alt={university.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-gray-900 text-sm truncate">
                {university.name}
              </h4>
              <p className="text-xs text-gray-600">{university.country}</p>
              <div className="flex gap-2 mt-1">
                <span className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
                  ${university.priceRange.min}
                </span>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
