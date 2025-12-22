'use client';

import UniversityDetail from '@/components/universities/university-detail';
import UniversityFilters, { FilterState } from '@/components/universities/university-filters';
import UniversityList from '@/components/universities/university-list';
import StudentEnrollmentForm from '@/components/forms/student-enrollment-form';
import Navbar from '@/components/sections/navbar';
import TopBar from '@/components/sections/top-bar';
import Footer from '@/components/sections/footer';
import { University } from '@/models/University';
import { useEffect, useState } from 'react';

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({});
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);

  // Fetch all universities
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await fetch('/api/universities');
        const data = await response.json();
        setUniversities(data);
        setFilteredUniversities(data);
        if (data.length > 0) {
          setSelectedUniversity(data[0]);
        }
      } catch (error) {
        console.error('Error fetching universities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  // Apply filters
  const applyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);

    let filtered = universities;

    if (newFilters.minPrice !== undefined || newFilters.maxPrice !== undefined) {
      filtered = filtered.filter((uni) => {
        const minMatch =
          newFilters.minPrice === undefined ||
          uni.priceRange.max >= newFilters.minPrice;
        const maxMatch =
          newFilters.maxPrice === undefined ||
          uni.priceRange.min <= newFilters.maxPrice;
        return minMatch && maxMatch;
      });
    }

    if (newFilters.subject) {
      filtered = filtered.filter((uni) =>
        uni.subjects.includes(newFilters.subject!)
      );
    }

    if (newFilters.minIelts !== undefined) {
      filtered = filtered.filter(
        (uni) =>
          !uni.requirements.ielts ||
          uni.requirements.ielts <= newFilters.minIelts!
      );
    }

    if (newFilters.minDuolingo !== undefined) {
      filtered = filtered.filter(
        (uni) =>
          !uni.requirements.duolingo ||
          uni.requirements.duolingo <= newFilters.minDuolingo!
      );
    }

    setFilteredUniversities(filtered);
    if (filtered.length > 0) {
      setSelectedUniversity(filtered[0]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading universities...</p>
        </div>
      </div>
    );
  }

  // Get all unique subjects
  const allSubjects = Array.from(
    new Set(universities.flatMap((uni) => uni.subjects))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar and Navbar */}
      <TopBar />
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Find Your University</h1>
          <p className="text-purple-100 text-lg">
            Explore top universities with our advanced search and filter options
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Filters and List */}
          <div className="lg:col-span-1 space-y-6">
            <UniversityFilters subjects={allSubjects} onFilterChange={applyFilters} />
            <UniversityList
              universities={filteredUniversities}
              selectedId={selectedUniversity?._id}
              onSelect={setSelectedUniversity}
            />
          </div>

          {/* Main Content - University Detail */}
          <div className="lg:col-span-2">
            {selectedUniversity ? (
              <UniversityDetail university={selectedUniversity} onApplyClick={() => setShowEnrollmentForm(true)} />
            ) : (
              <div className="bg-white rounded-lg p-12 text-center">
                <p className="text-gray-600 text-lg">
                  No universities match your criteria. Try adjusting your filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enrollment Form Modal */}
      {showEnrollmentForm && (
        <StudentEnrollmentForm
          onClose={() => setShowEnrollmentForm(false)}
          countries={universities.map((u) => u.country).filter((c, i, arr) => arr.indexOf(c) === i)}
          subjects={allSubjects}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
