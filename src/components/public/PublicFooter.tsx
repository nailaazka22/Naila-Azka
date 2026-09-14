import React from 'react';

interface PublicFooterProps {
  nama: string;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ nama }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 sm:py-12 border-t border-slate-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-medium text-slate-700">
          {nama}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          © {currentYear} • Hak Cipta Dilindungi Undang-Undang
        </p>
      </div>
    </footer>
  );
};
