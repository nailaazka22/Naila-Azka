import React from 'react';
import { Globe } from 'lucide-react';
import { Language } from '../../types';

interface LanguageSectionProps {
  languages: Language[];
}

export const LanguageSection: React.FC<LanguageSectionProps> = ({ languages }) => {
  if (!languages || languages.length === 0) return null;

  return (
    <section id="bahasa" className="py-14 sm:py-20 border-b border-slate-100 bg-slate-50/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <Globe className="w-3.5 h-3.5" />
            <span>Komunikasi Global</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Kemampuan Bahasa
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Bahasa komunikasi yang digunakan dalam interaksi profesional dan penulisan.
          </p>
        </div>

        {/* Format teks murni: Nama Bahasa — Level, tanpa visual progress bar sesuai PRD 3.6 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4 max-w-3xl mx-auto">
          {languages.map((lang) => (
            <div
              key={lang.id}
              className="p-4 rounded-xl bg-white border border-slate-200 text-center shadow-2xs hover:border-blue-300 transition-colors"
            >
              <p className="text-sm sm:text-base font-medium text-slate-800">
                <span className="font-semibold text-slate-900">{lang.nama_bahasa}</span>
                <span className="text-slate-400 mx-2">—</span>
                <span className="text-blue-700">{lang.level}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
