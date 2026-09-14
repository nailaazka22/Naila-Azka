import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Database, Settings2 } from 'lucide-react';
import { isSupabaseConfigured, getSupabaseConfig, saveSupabaseConfig } from '../../lib/supabase';
import { signInAdmin } from '../../services/portfolioService';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToPublic: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToPublic }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Config modal / drawer for Supabase credentials if user needs to connect in preview
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);
  const config = getSupabaseConfig();
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(config.url);
  const [supabaseAnonKeyInput, setSupabaseAnonKeyInput] = useState(config.anonKey);
  const [savedNotice, setSavedNotice] = useState(false);

  const supabaseReady = isSupabaseConfigured();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Silakan isi email dan kata sandi.');
      return;
    }

    setLoading(true);
    try {
      const { user, error } = await signInAdmin(email, password);
      if (error) {
        setErrorMessage(error);
      } else if (user) {
        onLoginSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Gagal melakukan login.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(supabaseUrlInput, supabaseAnonKeyInput);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      setShowConfigDrawer(false);
      window.location.reload();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20 mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Login Admin Portofolio
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Halaman khusus pemilik portofolio untuk mengelola konten dan aset.
          </p>
        </div>

        {/* Status Koneksi Supabase */}
        <div className="mt-6">
          <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 ${
            supabaseReady
              ? 'bg-blue-50/70 border-blue-200 text-blue-900'
              : 'bg-amber-50/70 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 shrink-0 text-blue-600" />
              <span>
                {supabaseReady ? (
                  <><strong>Supabase Auth Terhubung:</strong> Menggunakan validasi akun Supabase</>
                ) : (
                  <><strong>Koneksi Supabase Mandiri:</strong> Belum terhubung via .env</>
                )}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowConfigDrawer(!showConfigDrawer)}
              className="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-xs font-semibold border border-slate-200 shadow-2xs inline-flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Koneksi</span>
            </button>
          </div>
        </div>

        {/* Form Kartu */}
        <div className="mt-4 bg-white py-8 px-5 sm:px-8 shadow-sm border border-slate-200 rounded-2xl">
          
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Login Gagal</p>
                <p className="text-xs mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Akun Admin
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <span>Memvalidasi...</span>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sesuai PRD Section 4.1: Informasi pengelolaan akun via Supabase */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-start gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p>
                Sesuai PRD 4.1, akun admin dikelola melalui dashboard Supabase (<strong>Authentication → Users → Add User</strong>). Tidak ada akun bawaan hardcode.
              </p>
            </div>
          </div>

          {/* Tombol kembali ke halaman publik */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={onBackToPublic}
              className="text-xs text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
            >
              ← Kembali ke Halaman Publik
            </button>
          </div>
        </div>

        {/* Supabase Config Drawer / Helper */}
        {showConfigDrawer && (
          <div className="mt-6 bg-white p-5 rounded-2xl border border-blue-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Pengaturan Supabase (Opsional Langsung di Browser)
            </h3>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Anda juga dapat menghubungkan URL dan Anon Key project Supabase Anda langsung di sini jika belum dikonfigurasi di file environment.
            </p>

            <form onSubmit={handleSaveConfig} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  SUPABASE URL
                </label>
                <input
                  type="text"
                  value={supabaseUrlInput}
                  onChange={(e) => setSupabaseUrlInput(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  SUPABASE ANON KEY
                </label>
                <input
                  type="text"
                  value={supabaseAnonKeyInput}
                  onChange={(e) => setSupabaseAnonKeyInput(e.target.value)}
                  placeholder="eyJhbGciOi..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  {savedNotice ? 'Tersimpan! Memuat...' : 'Simpan Koneksi'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfigDrawer(false)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
