import React, { useEffect, useState, useCallback } from 'react';
import {
  getPortfolioData,
  getCurrentAdminSession,
  AuthUser,
} from './services/portfolioService';
import { getSupabase } from './lib/supabase';
import { PortfolioData } from './types';
import { defaultPortfolioData } from './data/defaultData';
import { PublicNavbar } from './components/public/PublicNavbar';
import { HeroSection } from './components/public/HeroSection';
import { SkillsSection } from './components/public/SkillsSection';
import { ProjectsSection } from './components/public/ProjectsSection';
import { ExperienceSection } from './components/public/ExperienceSection';
import { CourseSection } from './components/public/CourseSection';
import { LanguageSection } from './components/public/LanguageSection';
import { ContactSection } from './components/public/ContactSection';
import { PublicFooter } from './components/public/PublicFooter';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
  const [loading, setLoading] = useState(true);
  const [currentRoute, setCurrentRoute] = useState<'public' | 'admin'>('public');
  const [adminUser, setAdminUser] = useState<AuthUser | null>(null);

  // Fungsi sinkronisasi rute URL (/admin, /login, /signin, /auth, #admin, #login, dsb)
  const checkRouteFromUrl = useCallback(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();

    const isAdminRoute =
      path.startsWith('/admin') ||
      path.startsWith('/login') ||
      path.startsWith('/signin') ||
      path.startsWith('/auth') ||
      path.startsWith('/dashboard') ||
      hash === '#admin' ||
      hash.startsWith('#/admin') ||
      hash === '#login' ||
      hash.startsWith('#/login') ||
      hash === '#signin' ||
      hash.startsWith('#/signin') ||
      hash === '#auth' ||
      hash.startsWith('#/auth') ||
      hash.includes('access_token=') ||
      hash.includes('error_description=') ||
      hash.includes('type=recovery') ||
      hash.includes('type=signup') ||
      search.includes('admin') ||
      search.includes('login') ||
      search.includes('code=');

    if (isAdminRoute) {
      setCurrentRoute('admin');
    } else {
      setCurrentRoute('public');
    }
  }, []);

  // Muat data portofolio awal & cek sesi admin
  const loadInitialData = useCallback(async () => {
    try {
      const [fetchedData, session] = await Promise.all([
        getPortfolioData(),
        getCurrentAdminSession(),
      ]);
      setData(fetchedData);
      setAdminUser(session);

      // Sinkronkan metadata judul dokumen sesuai PRD Section 3.9
      if (fetchedData?.profile?.nama) {
        document.title = `${fetchedData.profile.nama} | Personal Portfolio Website`;
      }
    } catch (err) {
      console.error('Error loading portfolio data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkRouteFromUrl();
    loadInitialData();

    // Event listener untuk perubahan rute
    window.addEventListener('popstate', checkRouteFromUrl);
    window.addEventListener('hashchange', checkRouteFromUrl);

    // Listener otomatis dari Supabase Auth (misal saat diarahkan dari email konfirmasi/magic link)
    const supabase = getSupabase();
    let authUnsubscribe: (() => void) | null = null;
    if (supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setAdminUser({
            email: session.user.email || '',
            id: session.user.id,
            source: 'supabase',
          });
        } else if (event === 'SIGNED_OUT') {
          setAdminUser(null);
        }
      });
      authUnsubscribe = () => authListener.subscription.unsubscribe();
    }

    // Keyboard shortcut tersembunyi (Ctrl + Alt + A) untuk akses admin langsung saat di iframe
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        navigateToAdmin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', checkRouteFromUrl);
      window.removeEventListener('hashchange', checkRouteFromUrl);
      window.removeEventListener('keydown', handleKeyDown);
      if (authUnsubscribe) authUnsubscribe();
    };
  }, [checkRouteFromUrl, loadInitialData]);

  // Perbarui metadata setiap kali profil berubah
  useEffect(() => {
    if (data?.profile?.nama) {
      const title = `${data.profile.nama} | Personal Portfolio Website`;
      document.title = title;

      // Update meta tag og:title & description jika ada
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', title);

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && data.profile.deskripsi) {
        metaDesc.setAttribute('content', data.profile.deskripsi);
      }
    }
  }, [data.profile]);

  const navigateToAdmin = () => {
    try {
      window.history.pushState({}, '', '/admin');
    } catch {
      window.location.hash = 'admin';
    }
    setCurrentRoute('admin');
  };

  const navigateToPublic = () => {
    try {
      window.history.pushState({}, '', '/');
    } catch {
      window.location.hash = '';
    }
    setCurrentRoute('public');
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-medium text-slate-500 tracking-wide">Memuat Portofolio...</p>
        </div>
      </div>
    );
  }

  // ================= ADMIN ROUTE (PROTECTED) =================
  if (currentRoute === 'admin') {
    if (!adminUser) {
      return (
        <AdminLogin
          onLoginSuccess={async () => {
            const session = await getCurrentAdminSession();
            setAdminUser(session);
          }}
          onBackToPublic={navigateToPublic}
        />
      );
    }

    return (
      <AdminDashboard
        data={data}
        onRefreshData={async () => {
          const refreshed = await getPortfolioData();
          setData(refreshed);
        }}
        onViewPublic={navigateToPublic}
      />
    );
  }

  // ================= PUBLIC ROUTE =================
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Navbar Publik */}
      <PublicNavbar
        nama={data.profile.nama}
        onNavigate={scrollToSection}
      />

      {/* Konten Utama Halaman Publik */}
      <main className="flex-1">
        {/* 3.1 Hero Section */}
        <HeroSection
          profile={data.profile}
          onScrollToSection={scrollToSection}
        />

        {/* 3.2 Skills Section */}
        <SkillsSection skills={data.skills} />

        {/* 3.3 Projects Section */}
        <ProjectsSection projects={data.projects} />

        {/* 3.4 Experience Section */}
        <ExperienceSection experiences={data.experiences} />

        {/* 3.5 Course & Training Section */}
        <CourseSection courses={data.courses} />

        {/* 3.6 Languages Section */}
        <LanguageSection languages={data.languages} />

        {/* 3.7 Contact Section */}
        <ContactSection contacts={data.contacts} />
      </main>

      {/* Footer Publik dengan tombol login tersembunyi/halus */}
      <PublicFooter
        nama={data.profile.nama}
        onNavigateToAdmin={navigateToAdmin}
      />
    </div>
  );
}
