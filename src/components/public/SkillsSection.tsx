import React from 'react';
import { Skill } from '../../types';

interface SkillsSectionProps {
  skills: Skill[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  if (!skills || skills.length === 0) return null;

  return (
    <section id="keahlian" className="py-14 sm:py-20 border-b border-slate-100 bg-slate-50/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Keahlian & Kompetensi
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Keterampilan yang dikuasai untuk mendukung keberhasilan proyek dan kolaborasi profesional.
          </p>
        </div>

        {/* Box/badge sederhana berisi nama keahlian saja, tanpa label level */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 max-w-4xl mx-auto">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm font-medium shadow-2xs hover:border-blue-400 hover:text-blue-700 transition-colors"
            >
              <span>{skill.nama_skill}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
