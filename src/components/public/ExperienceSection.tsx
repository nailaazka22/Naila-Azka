import React from 'react';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { Experience } from '../../types';

interface ExperienceSectionProps {
  experiences: Experience[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  if (!experiences || experiences.length === 0) return null;

  return (
    <section id="pengalaman" className="py-14 sm:py-20 border-b border-slate-100 bg-slate-50/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Rekam Jejak</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Pengalaman Kerja
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Pengalaman profesional dalam berbagai instansi, studio kerja, dan organisasi.
          </p>
        </div>

        {/* Timeline / List Pengalaman */}
        <div className="space-y-4 sm:space-y-6">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-2xs hover:border-blue-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-4 mb-2">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  {exp.nama_instansi}
                </h3>
                <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg w-fit">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{exp.tahun}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 font-medium mb-3">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{exp.lokasi}</span>
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {exp.deskripsi}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
