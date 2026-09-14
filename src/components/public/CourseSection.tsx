import React from 'react';
import { Award, Calendar, MapPin, Building2 } from 'lucide-react';
import { Course } from '../../types';

interface CourseSectionProps {
  courses: Course[];
}

export const CourseSection: React.FC<CourseSectionProps> = ({ courses }) => {
  if (!courses || courses.length === 0) return null;

  return (
    <section id="pelatihan" className="py-14 sm:py-20 border-b border-slate-100 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Pengembangan Diri</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Pelatihan & Course
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Program peningkatan kapasitas, workshop sertifikasi, dan pembelajaran terstruktur.
          </p>
        </div>

        {/* List Pelatihan */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs hover:border-blue-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 mb-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {course.nama_course}
                </h3>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg w-fit">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{course.tahun}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-slate-500 font-medium mb-3">
                <span className="inline-flex items-center gap-1 text-slate-700 font-semibold">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>{course.penyelenggara}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{course.lokasi}</span>
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {course.deskripsi}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
