import React from 'react';
import { ExternalLink, FileText, ArrowDown, Send } from 'lucide-react';
import { Profile } from '../../types';

interface HeroSectionProps {
  profile: Profile;
  onScrollToSection: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile, onScrollToSection }) => {
  // Pecah nama untuk memberikan highlight warna biru pada kata pertama/nama utama sesuai PRD Section 2.1 & 3.1
  const nameParts = profile.nama.trim().split(' ');
  const firstName = nameParts[0] || '';
  const restOfName = nameParts.slice(1).join(' ');

  const hasResume = Boolean(profile.resume_url && profile.resume_url.trim().length > 0);

  return (
    <section id="profil" className="relative pt-12 pb-16 md:py-24 border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile: 1 kolom (foto atas, teks bawah). Desktop: 2 kolom (foto kiri, teks kanan) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center">
          
          {/* Kolom Kiri (Desktop) / Atas (Mobile): Foto profil rasio 1:1, rounded, status */}
          <div className="md:col-span-5 flex flex-col items-center md:items-start">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72">
              <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm border-4 border-white bg-slate-100 ring-1 ring-slate-200">
                <img
                  src={profile.foto_profil_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'}
                  alt={profile.nama}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            {/* Label status kecil di bawah foto */}
            {profile.status && (
              <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs sm:text-sm font-medium text-blue-800">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                <span>{profile.status}</span>
              </div>
            )}
          </div>

          {/* Kolom Kanan (Desktop) / Bawah (Mobile): Konten teks */}
          <div className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left">
            {/* Badge kecil di atas nama */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold tracking-wide uppercase mb-4">
              <span>Portofolio Profesional</span>
            </div>

            {/* Nama besar; bagian nama utama diberi warna biru */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              <span className="text-blue-600">{firstName}</span>
              {restOfName ? ` ${restOfName}` : ''}
            </h1>

            {/* Tagline/jabatan di bawah nama */}
            <p className="mt-3 text-lg sm:text-xl font-medium text-slate-700">
              {profile.tagline}
            </p>

            {/* Deskripsi singkat */}
            <p className="mt-4 text-base text-slate-600 leading-relaxed max-w-2xl">
              {profile.deskripsi}
            </p>

            {/* Tombol Aksi */}
            <div className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-3.5 w-full sm:w-auto">
              {/* Hubungi Saya - primary, warna biru */}
              <button
                id="btn-hubungi-saya"
                type="button"
                onClick={() => onScrollToSection('kontak')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Hubungi Saya</span>
              </button>

              {/* Lihat Project - secondary / outline */}
              <button
                id="btn-lihat-project"
                type="button"
                onClick={() => onScrollToSection('project')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-300 hover:border-blue-600 hover:text-blue-600 bg-white text-slate-700 text-sm font-semibold shadow-sm transition-colors cursor-pointer"
              >
                <ArrowDown className="w-4 h-4" />
                <span>Lihat Project</span>
              </button>

              {/* Resume - kondisional: HANYA tampil jika admin mengisi link resume */}
              {hasResume && (
                <a
                  id="btn-resume"
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 text-blue-700 text-sm font-semibold transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Resume</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
