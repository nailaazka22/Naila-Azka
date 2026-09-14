import React from 'react';
import { ExternalLink, FolderGit2 } from 'lucide-react';
import { Project } from '../../types';

interface ProjectsSectionProps {
  projects: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  if (!projects || projects.length === 0) return null;

  return (
    <section id="project" className="py-14 sm:py-20 border-b border-slate-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Karya & Portofolio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Project Terpilih
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Ragam proyek, inisiatif kampanye, publikasi karya, dan hasil kolaborasi yang telah diselesaikan.
          </p>
        </div>

        {/* Mobile: 1 kolom, Desktop: 2 kolom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-blue-300 transition-all group"
            >
              {/* Gambar Project */}
              <div className="relative w-full aspect-16/9 bg-slate-100 overflow-hidden">
                <img
                  src={project.gambar_url || 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80'}
                  alt={project.judul}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
              </div>

              {/* Konten Project */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {project.judul}
                  </h3>
                  <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {project.deskripsi}
                  </p>
                </div>

                {/* Link Project */}
                {project.link && (
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <span>Buka Project / Tautan</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
