export const SUPABASE_SQL_SCHEMA = `-- ====================================================================
-- SKEMA DATABASE LENGKAP SUPABASE (POSTGRESQL) - PORTOFOLIO PRIBADI
-- Sesuai Spesifikasi PRD v1.5
-- Aman dijalankan berulang kali (Idempotent / Drop policy if exists)
-- ====================================================================

-- 1. TABEL: Profile
CREATE TABLE IF NOT EXISTS public.profile (
  id TEXT PRIMARY KEY DEFAULT 'main-profile',
  nama TEXT NOT NULL,
  tagline TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  status TEXT DEFAULT 'Terbuka untuk Kolaborasi',
  foto_profil_url TEXT DEFAULT '',
  resume_url TEXT DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. TABEL: Skills
CREATE TABLE IF NOT EXISTS public.skills (
  id TEXT PRIMARY KEY,
  nama_skill TEXT NOT NULL,
  urutan INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. TABEL: Projects
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  judul TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  gambar_url TEXT NOT NULL,
  link TEXT DEFAULT '',
  urutan INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. TABEL: Experiences
CREATE TABLE IF NOT EXISTS public.experiences (
  id TEXT PRIMARY KEY,
  nama_instansi TEXT NOT NULL,
  tahun TEXT NOT NULL,
  lokasi TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  urutan INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. TABEL: Courses & Training
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  nama_course TEXT NOT NULL,
  penyelenggara TEXT NOT NULL,
  tahun TEXT NOT NULL,
  lokasi TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  urutan INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. TABEL: Languages
CREATE TABLE IF NOT EXISTS public.languages (
  id TEXT PRIMARY KEY,
  nama_bahasa TEXT NOT NULL,
  level TEXT NOT NULL,
  urutan INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. TABEL: Contacts
CREATE TABLE IF NOT EXISTS public.contacts (
  id TEXT PRIMARY KEY,
  tipe TEXT NOT NULL,
  value TEXT NOT NULL,
  urutan INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Aturan: Publik BISA membaca (SELECT). Hanya Admin terautentikasi (authenticated)
-- yang dapat Menambah, Mengubah, dan Menghapus (ALL).
-- ====================================================================

ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- 1. Profile Policies
DROP POLICY IF EXISTS "Publik dapat membaca profil" ON public.profile;
CREATE POLICY "Publik dapat membaca profil" ON public.profile FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin mengelola profile" ON public.profile;
CREATE POLICY "Admin mengelola profile" ON public.profile FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. Skills Policies
DROP POLICY IF EXISTS "Publik dapat membaca skills" ON public.skills;
CREATE POLICY "Publik dapat membaca skills" ON public.skills FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin mengelola skills" ON public.skills;
CREATE POLICY "Admin mengelola skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. Projects Policies
DROP POLICY IF EXISTS "Publik dapat membaca projects" ON public.projects;
CREATE POLICY "Publik dapat membaca projects" ON public.projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin mengelola projects" ON public.projects;
CREATE POLICY "Admin mengelola projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. Experiences Policies
DROP POLICY IF EXISTS "Publik dapat membaca experiences" ON public.experiences;
CREATE POLICY "Publik dapat membaca experiences" ON public.experiences FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin mengelola experiences" ON public.experiences;
CREATE POLICY "Admin mengelola experiences" ON public.experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. Courses Policies
DROP POLICY IF EXISTS "Publik dapat membaca courses" ON public.courses;
CREATE POLICY "Publik dapat membaca courses" ON public.courses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin mengelola courses" ON public.courses;
CREATE POLICY "Admin mengelola courses" ON public.courses FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. Languages Policies
DROP POLICY IF EXISTS "Publik dapat membaca languages" ON public.languages;
CREATE POLICY "Publik dapat membaca languages" ON public.languages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin mengelola languages" ON public.languages;
CREATE POLICY "Admin mengelola languages" ON public.languages FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. Contacts Policies
DROP POLICY IF EXISTS "Publik dapat membaca contacts" ON public.contacts;
CREATE POLICY "Publik dapat membaca contacts" ON public.contacts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin mengelola contacts" ON public.contacts;
CREATE POLICY "Admin mengelola contacts" ON public.contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ====================================================================
-- SUPABASE STORAGE: BUCKETS & POLICIES (PRD Section 5)
-- Buckets: 'avatars' (foto profil) & 'projects' (gambar proyek)
-- ====================================================================

-- Buat Bucket Publik jika belum ada
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('projects', 'projects', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Kebijakan Storage Read Publik
DROP POLICY IF EXISTS "Public Read Avatars" ON storage.objects;
CREATE POLICY "Public Read Avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Public Read Projects" ON storage.objects;
CREATE POLICY "Public Read Projects" ON storage.objects FOR SELECT USING (bucket_id = 'projects');

-- Kebijakan Storage Write / Upload untuk Admin Terautentikasi
DROP POLICY IF EXISTS "Admin Upload Avatars" ON storage.objects;
CREATE POLICY "Admin Upload Avatars" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Admin Update Avatars" ON storage.objects;
CREATE POLICY "Admin Update Avatars" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Admin Delete Avatars" ON storage.objects;
CREATE POLICY "Admin Delete Avatars" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Admin Upload Projects" ON storage.objects;
CREATE POLICY "Admin Upload Projects" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'projects');

DROP POLICY IF EXISTS "Admin Update Projects" ON storage.objects;
CREATE POLICY "Admin Update Projects" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'projects');

DROP POLICY IF EXISTS "Admin Delete Projects" ON storage.objects;
CREATE POLICY "Admin Delete Projects" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'projects');

-- ====================================================================
-- DATA AWAL (SEED DATA / DEFAULT PORTOFOLIO)
-- Menjamin website langsung memiliki data saat pertama kali terkoneksi
-- ====================================================================

INSERT INTO public.profile (id, nama, tagline, deskripsi, status, foto_profil_url, resume_url)
VALUES (
  'main-profile',
  'Alex Pratama',
  'Full Stack Developer & Cloud Enthusiast',
  'Pengembang perangkat lunak berdedikasi dengan pengalaman dalam membangun aplikasi web modern, arsitektur cloud, dan solusi sistem yang skalabel.',
  'Terbuka untuk Kolaborasi',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://drive.google.com'
)
ON CONFLICT (id) DO NOTHING;

-- Skills Awal
INSERT INTO public.skills (id, nama_skill, urutan)
VALUES
  ('sk-1', 'TypeScript', 1),
  ('sk-2', 'React.js', 2),
  ('sk-3', 'Next.js', 3),
  ('sk-4', 'Tailwind CSS', 4),
  ('sk-5', 'Node.js', 5),
  ('sk-6', 'PostgreSQL', 6),
  ('sk-7', 'Supabase', 7),
  ('sk-8', 'Git & GitHub', 8),
  ('sk-9', 'Docker', 9),
  ('sk-10', 'Cloud Architecture', 10)
ON CONFLICT (id) DO NOTHING;

-- Projects Awal
INSERT INTO public.projects (id, judul, deskripsi, gambar_url, link, urutan)
VALUES
  (
    'prj-1',
    'Enterprise Resource Planning System',
    'Sistem manajemen rantai pasok dan inventaris terintegrasi dengan analitik real-time dan manajemen multi-gudang.',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    'https://github.com',
    1
  ),
  (
    'prj-2',
    'AI-Powered Clinical Diagnostics Platform',
    'Platform telemedisin berbasis AI untuk analisis awal citra medis dan penjadwalan konsultasi dokter spesialis.',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    'https://github.com',
    2
  ),
  (
    'prj-3',
    'Modern FinTech Investment Mobile App',
    'Aplikasi investasi reksa dana dan obligasi dengan verifikasi identitas e-KYC otomatis dan portofolio tracker.',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    'https://drive.google.com',
    3
  )
ON CONFLICT (id) DO NOTHING;

-- Experiences Awal
INSERT INTO public.experiences (id, nama_instansi, tahun, lokasi, deskripsi, urutan)
VALUES
  (
    'exp-1',
    'PT Teknologi Nusantara Inovatif',
    '2022 — Sekarang',
    'Jakarta, Indonesia',
    'Memimpin perancangan dan migrasi arsitektur microservices, mengoptimalkan query database PostgreSQL, dan mengimplementasikan CI/CD pipeline.',
    1
  ),
  (
    'exp-2',
    'Digital Global Solusindo',
    '2020 — 2022',
    'Bandung, Indonesia',
    'Mengembangkan antarmuka aplikasi web berskala enterprise menggunakan React dan TypeScript serta integrasi RESTful API terstandar.',
    2
  )
ON CONFLICT (id) DO NOTHING;

-- Courses Awal
INSERT INTO public.courses (id, nama_course, penyelenggara, tahun, lokasi, deskripsi, urutan)
VALUES
  (
    'crs-1',
    'Architecting on Cloud & Kubernetes Mastery',
    'Google Cloud Certified Academy',
    '2023',
    'Online / Jakarta',
    'Spesialisasi manajemen container, orkestrasi microservices, dan implementasi automated failover.',
    1
  ),
  (
    'crs-2',
    'Full Stack Web Development Professional Certification',
    'Dicoding Academy Indonesia',
    '2021',
    'Online',
    'Kurikulum mendalam tentang pengembangan arsitektur modern, security web standards, dan database tuning.',
    2
  )
ON CONFLICT (id) DO NOTHING;

-- Languages Awal
INSERT INTO public.languages (id, nama_bahasa, level, urutan)
VALUES
  ('lang-1', 'Bahasa Indonesia', 'Native', 1),
  ('lang-2', 'Bahasa Inggris', 'Professional Working', 2),
  ('lang-3', 'Bahasa Jepang', 'Elementary', 3)
ON CONFLICT (id) DO NOTHING;

-- Contacts Awal
INSERT INTO public.contacts (id, tipe, value, urutan)
VALUES
  ('cnt-1', 'whatsapp', '+6281234567890', 1),
  ('cnt-2', 'email', 'alex.pratama@example.com', 2),
  ('cnt-3', 'instagram', 'https://instagram.com/alexpratama', 3),
  ('cnt-4', 'linkedin', 'https://linkedin.com/in/alexpratama', 4)
ON CONFLICT (id) DO NOTHING;
`;
