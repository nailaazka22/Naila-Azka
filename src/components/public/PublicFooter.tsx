import React from 'react';
import { Lock } from 'lucide-react';

interface PublicFooterProps {
  nama: string;
  onNavigateToAdmin?: () => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ nama, onNavigateToAdmin }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 sm:py-12 border-t border-slate-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-medium text-slate-700">
          {nama}
        </p>
        <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <span>© {currentYear} • Hak Cipta Dilindungi Undang-Undang</span>
          {onNavigateToAdmin && (
            <button
              type="button"
              onClick={onNavigateToAdmin}
              title="Akses Login Admin (Shortcut: Ctrl + Alt + A)"
              className="inline-flex items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer p-1 rounded-md hover:bg-slate-50 ml-1"
              aria-label="Akses Admin"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium text-slate-400 hover:text-blue-600">Login</span>
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};

