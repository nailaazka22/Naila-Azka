import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface PublicNavbarProps {
  nama: string;
  onNavigate: (sectionId: string) => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ nama, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Profil', id: 'profil' },
    { label: 'Keahlian', id: 'keahlian' },
    { label: 'Project', id: 'project' },
    { label: 'Pengalaman', id: 'pengalaman' },
    { label: 'Pelatihan', id: 'pelatihan' },
    { label: 'Bahasa', id: 'bahasa' },
    { label: 'Kontak', id: 'kontak' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const nameParts = nama.trim().split(' ');
  const displayBrand = nameParts[0] || 'Portofolio';

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand/Nama */}
          <button
            type="button"
            onClick={() => handleLinkClick('profil')}
            className="flex items-center gap-2 text-left cursor-pointer group"
          >
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              {displayBrand}
              <span className="text-blue-600 font-extrabold">.</span>
            </span>
          </button>

          {/* Desktop Nav Links (PRD 3.8: Tidak ada link admin!) */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleLinkClick(link.id)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleLinkClick(link.id)}
                className="block w-full text-left px-3.5 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
