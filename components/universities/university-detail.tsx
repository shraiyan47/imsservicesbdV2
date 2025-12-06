'use client';

import { University } from '@/models/University';
import Image from 'next/image';
import Link from 'next/link';

interface UniversityDetailProps {
  university: University;
}

export default function UniversityDetail({ university }: UniversityDetailProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header Image */}
      <div className="relative h-64 w-full">
        <Image
          src={university.image || '/placeholder.svg?height=256&width=512&query=university'}
          alt={university.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {university.name}
          </h1>
          <p className="text-lg text-gray-600">{university.country}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Price Range</p>
            <p className="text-xl font-bold text-purple-600">
              ${university.priceRange.min}-${university.priceRange.max}
            </p>
          </div>
          {university.acceptanceRate && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Acceptance Rate</p>
              <p className="text-xl font-bold text-blue-600">
                {university.acceptanceRate}%
              </p>
            </div>
          )}
          {university.ranking && (
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Ranking</p>
              <p className="text-xl font-bold text-green-600">#{university.ranking}</p>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">About</h2>
          <p className="text-gray-700 leading-relaxed">{university.description}</p>
        </div>

        {/* Requirements */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Entry Requirements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {university.requirements.ielts && (
              <div className="border border-gray-200 p-4 rounded-lg">
                <p className="text-sm text-gray-600">IELTS</p>
                <p className="text-lg font-semibold text-gray-900">
                  {university.requirements.ielts}
                </p>
              </div>
            )}
            {university.requirements.duolingo && (
              <div className="border border-gray-200 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Duolingo</p>
                <p className="text-lg font-semibold text-gray-900">
                  {university.requirements.duolingo}
                </p>
              </div>
            )}
            {university.requirements.toefl && (
              <div className="border border-gray-200 p-4 rounded-lg">
                <p className="text-sm text-gray-600">TOEFL</p>
                <p className="text-lg font-semibold text-gray-900">
                  {university.requirements.toefl}
                </p>
              </div>
            )}
            {university.requirements.gre && (
              <div className="border border-gray-200 p-4 rounded-lg">
                <p className="text-sm text-gray-600">GRE</p>
                <p className="text-lg font-semibold text-gray-900">
                  {university.requirements.gre}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Subjects */}
        {university.subjects && university.subjects.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Popular Subjects
            </h2>
            <div className="flex flex-wrap gap-2">
              {university.subjects.map((subject) => (
                <span
                  key={subject}
                  className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Featured Programs */}
        {university.featuredPrograms && university.featuredPrograms.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Featured Programs
            </h2>
            <ul className="space-y-2">
              {university.featuredPrograms.map((program, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">→</span>
                  <span className="text-gray-700">{program}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex gap-4 pt-6 border-t">
          <Link
            href="/"
            className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition text-center"
          >
            Start Application
          </Link>
          {university.website && (
            <a
              href={university.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition text-center"
            >
              Visit Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
