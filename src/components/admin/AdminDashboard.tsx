import React, { useState } from 'react';
import {
  User,
  FolderGit2,
  Sparkles,
  Briefcase,
  Award,
  Globe,
  Mail,
  Database,
  LogOut,
  Eye,
  Plus,
  Trash2,
  Edit2,
  Check,
  Save,
  Copy,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  RefreshCw,
} from 'lucide-react';
import {
  PortfolioData,
  Profile,
  Project,
  Skill,
  Experience,
  Course,
  Language,
  Contact,
  ContactType,
} from '../../types';
import {
  updateProfile,
  addProject,
  updateProject,
  deleteProject,
  addSkill,
  updateSkill,
  deleteSkill,
  addExperience,
  updateExperience,
  deleteExperience,
  addCourse,
  updateCourse,
  deleteCourse,
  addLanguage,
  updateLanguage,
  deleteLanguage,
  addContact,
  updateContact,
  deleteContact,
  signOutAdmin,
} from '../../services/portfolioService';
import { isSupabaseConfigured, getSupabaseConfig, saveSupabaseConfig } from '../../lib/supabase';
import { SUPABASE_SQL_SCHEMA } from '../../data/supabaseSql';
import { ImageUploader } from './ImageUploader';

interface AdminDashboardProps {
  data: PortfolioData;
  onRefreshData: () => Promise<void>;
  onViewPublic: () => void;
}

type TabType =
  | 'profil'
  | 'projects'
  | 'skills'
  | 'experiences'
  | 'courses'
  | 'languages'
  | 'contacts'
  | 'supabase';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  data,
  onRefreshData,
  onViewPublic,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('profil');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Profile Form State
  const [profileForm, setProfileForm] = useState<Profile>({ ...data.profile });

  // Projects State & Modal
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState({
    judul: '',
    deskripsi: '',
    gambar_url: '',
    link: '',
  });
  const [isAddingProject, setIsAddingProject] = useState(false);

  // Skills State
  const [newSkillName, setNewSkillName] = useState('');
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editingSkillName, setEditingSkillName] = useState('');

  // Experience State & Modal
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [expForm, setExpForm] = useState({
    nama_instansi: '',
    tahun: '',
    lokasi: '',
    deskripsi: '',
  });
  const [isAddingExp, setIsAddingExp] = useState(false);

  // Course State & Modal
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState({
    nama_course: '',
    penyelenggara: '',
    tahun: '',
    lokasi: '',
    deskripsi: '',
  });
  const [isAddingCourse, setIsAddingCourse] = useState(false);

  // Language State
  const [newLangName, setNewLangName] = useState('');
  const [newLangLevel, setNewLangLevel] = useState('Intermediate');
  const [editingLangId, setEditingLangId] = useState<string | null>(null);
  const [editingLangForm, setEditingLangForm] = useState({ nama_bahasa: '', level: '' });

  // Contact State
  const [newContactType, setNewContactType] = useState<ContactType>('whatsapp');
  const [newContactValue, setNewContactValue] = useState('');
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [editingContactValue, setEditingContactValue] = useState('');

  // Supabase Config Tab State
  const config = getSupabaseConfig();
  const [sbUrl, setSbUrl] = useState(config.url);
  const [sbKey, setSbKey] = useState(config.anonKey);
  const [copiedSql, setCopiedSql] = useState(false);

  const showNotification = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleLogout = async () => {
    await signOutAdmin();
    onViewPublic();
  };

  // ----------------- PROFILE HANDLER -----------------
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(profileForm);
      await onRefreshData();
      showNotification('Profil berhasil disimpan');
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan profil');
    } finally {
      setSaving(false);
    }
  };

  // ----------------- PROJECTS HANDLERS -----------------
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.judul || !projectForm.deskripsi) {
      alert('Judul dan deskripsi wajib diisi');
      return;
    }

    setSaving(true);
    try {
      if (editingProject) {
        await updateProject(editingProject.id, projectForm);
        showNotification('Project berhasil diperbarui');
      } else {
        await addProject(projectForm);
        showNotification('Project baru berhasil ditambahkan');
      }
      await onRefreshData();
      setEditingProject(null);
      setIsAddingProject(false);
      setProjectForm({ judul: '', deskripsi: '', gambar_url: '', link: '' });
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan project');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Hapus project ini?')) return;
    setSaving(true);
    try {
      await deleteProject(id);
      await onRefreshData();
      showNotification('Project dihapus');
    } finally {
      setSaving(false);
    }
  };

  // ----------------- SKILLS HANDLERS -----------------
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    setSaving(true);
    try {
      await addSkill(newSkillName.trim());
      setNewSkillName('');
      await onRefreshData();
      showNotification('Keahlian berhasil ditambahkan');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEditSkill = async (id: string) => {
    if (!editingSkillName.trim()) return;
    setSaving(true);
    try {
      await updateSkill(id, editingSkillName.trim());
      setEditingSkillId(null);
      await onRefreshData();
      showNotification('Keahlian diperbarui');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    setSaving(true);
    try {
      await deleteSkill(id);
      await onRefreshData();
      showNotification('Keahlian dihapus');
    } finally {
      setSaving(false);
    }
  };

  // ----------------- EXPERIENCES HANDLERS -----------------
  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expForm.nama_instansi || !expForm.tahun) {
      alert('Nama instansi dan tahun wajib diisi');
      return;
    }

    setSaving(true);
    try {
      if (editingExp) {
        await updateExperience(editingExp.id, expForm);
        showNotification('Pengalaman kerja diperbarui');
      } else {
        await addExperience(expForm);
        showNotification('Pengalaman kerja ditambahkan');
      }
      await onRefreshData();
      setEditingExp(null);
      setIsAddingExp(false);
      setExpForm({ nama_instansi: '', tahun: '', lokasi: '', deskripsi: '' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExp = async (id: string) => {
    if (!confirm('Hapus pengalaman kerja ini?')) return;
    setSaving(true);
    try {
      await deleteExperience(id);
      await onRefreshData();
      showNotification('Pengalaman dihapus');
    } finally {
      setSaving(false);
    }
  };

  // ----------------- COURSES HANDLERS -----------------
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.nama_course || !courseForm.penyelenggara) {
      alert('Nama pelatihan dan penyelenggara wajib diisi');
      return;
    }

    setSaving(true);
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, courseForm);
        showNotification('Pelatihan diperbarui');
      } else {
        await addCourse(courseForm);
        showNotification('Pelatihan ditambahkan');
      }
      await onRefreshData();
      setEditingCourse(null);
      setIsAddingCourse(false);
      setCourseForm({ nama_course: '', penyelenggara: '', tahun: '', lokasi: '', deskripsi: '' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Hapus pelatihan ini?')) return;
    setSaving(true);
    try {
      await deleteCourse(id);
      await onRefreshData();
      showNotification('Pelatihan dihapus');
    } finally {
      setSaving(false);
    }
  };

  // ----------------- LANGUAGES HANDLERS -----------------
  const handleAddLanguage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLangName.trim()) return;
    setSaving(true);
    try {
      await addLanguage({ nama_bahasa: newLangName.trim(), level: newLangLevel });
      setNewLangName('');
      await onRefreshData();
      showNotification('Bahasa ditambahkan');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEditLang = async (id: string) => {
    if (!editingLangForm.nama_bahasa.trim()) return;
    setSaving(true);
    try {
      await updateLanguage(id, editingLangForm);
      setEditingLangId(null);
      await onRefreshData();
      showNotification('Bahasa diperbarui');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLanguage = async (id: string) => {
    setSaving(true);
    try {
      await deleteLanguage(id);
      await onRefreshData();
      showNotification('Bahasa dihapus');
    } finally {
      setSaving(false);
    }
  };

  // ----------------- CONTACTS HANDLERS -----------------
  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactValue.trim()) return;
    setSaving(true);
    try {
      await addContact({ tipe: newContactType, value: newContactValue.trim() });
      setNewContactValue('');
      await onRefreshData();
      showNotification('Kontak ditambahkan');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEditContact = async (id: string) => {
    if (!editingContactValue.trim()) return;
    setSaving(true);
    try {
      await updateContact(id, { value: editingContactValue.trim() });
      setEditingContactId(null);
      await onRefreshData();
      showNotification('Kontak diperbarui');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteContact = async (id: string) => {
    setSaving(true);
    try {
      await deleteContact(id);
      await onRefreshData();
      showNotification('Kontak dihapus');
    } finally {
      setSaving(false);
    }
  };

  // ----------------- SUPABASE CONFIG SAVE -----------------
  const handleSaveSbConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(sbUrl, sbKey);
    showNotification('Konfigurasi Supabase disimpan! Memuat ulang data...');
    setTimeout(() => {
      window.location.reload();
    }, 900);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'profil', label: 'Profil Utama', icon: <User className="w-4 h-4" /> },
    { id: 'projects', label: 'Project / Karya', icon: <FolderGit2 className="w-4 h-4" />, count: data.projects.length },
    { id: 'skills', label: 'Keahlian (Skills)', icon: <Sparkles className="w-4 h-4" />, count: data.skills.length },
    { id: 'experiences', label: 'Pengalaman Kerja', icon: <Briefcase className="w-4 h-4" />, count: data.experiences.length },
    { id: 'courses', label: 'Pelatihan & Course', icon: <Award className="w-4 h-4" />, count: data.courses.length },
    { id: 'languages', label: 'Bahasa', icon: <Globe className="w-4 h-4" />, count: data.languages.length },
    { id: 'contacts', label: 'Informasi Kontak', icon: <Mail className="w-4 h-4" />, count: data.contacts.length },
    { id: 'supabase', label: 'Supabase & SQL', icon: <Database className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                aria-label="Toggle Navigation"
              >
                {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold text-slate-900">
                  Dashboard Admin
                </span>
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {isSupabaseConfigured() ? 'Supabase Aktif' : 'Penyimpanan Aktif'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={onViewPublic}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline">Lihat Website Publik</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                title="Keluar dari sesi admin"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Notification */}
      {saveSuccessMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white text-sm font-semibold rounded-2xl shadow-lg animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Main Layout: Sidebar & Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Sidebar Tabs (Desktop) */}
          <div className="hidden md:block md:col-span-3">
            <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 p-2 shadow-2xs space-y-1">
              <p className="px-3 pt-2 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Menu Konten
              </p>
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {tab.icon}
                      <span>{tab.label}</span>
                    </div>
                    {typeof tab.count === 'number' && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-blue-700 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Tabs Dropdown */}
          {mobileNavOpen && (
            <div className="md:hidden col-span-1 bg-white rounded-2xl border border-slate-200 p-2 shadow-sm space-y-1 mb-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileNavOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-left ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {tab.icon}
                      <span>{tab.label}</span>
                    </div>
                    {typeof tab.count === 'number' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab Content Panel */}
          <div className="md:col-span-9">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-2xs">
              
              {/* ================= TAB 1: PROFIL ================= */}
              {activeTab === 'profil' && (
                <div>
                  <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Kelola Data Profil</h2>
                      <p className="text-xs sm:text-sm text-slate-500">
                        Mengatur informasi hero, foto profil, dan tautan resume Google Drive.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    {/* Foto Profil */}
                    <div>
                      <ImageUploader
                        label="Foto Profil (Upload ke bucket avatars)"
                        bucket="avatars"
                        currentImageUrl={profileForm.foto_profil_url}
                        onImageUploaded={(url) => setProfileForm({ ...profileForm, foto_profil_url: url })}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          value={profileForm.nama}
                          onChange={(e) => setProfileForm({ ...profileForm, nama: e.target.value })}
                          required
                          className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                          Label Status (Di bawah foto)
                        </label>
                        <input
                          type="text"
                          value={profileForm.status}
                          onChange={(e) => setProfileForm({ ...profileForm, status: e.target.value })}
                          placeholder="Terbuka untuk Kolaborasi"
                          className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Tagline / Jabatan Profesional
                      </label>
                      <input
                        type="text"
                        value={profileForm.tagline}
                        onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                        required
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Deskripsi Singkat
                      </label>
                      <textarea
                        rows={4}
                        value={profileForm.deskripsi}
                        onChange={(e) => setProfileForm({ ...profileForm, deskripsi: e.target.value })}
                        required
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                        Link Resume (Google Drive) — Opsional
                      </label>
                      <p className="text-xs text-slate-500 mb-2">
                        Sesuai PRD Section 3.1: Jika kosong, tombol Resume di homepage tidak akan ditampilkan sama sekali.
                      </p>
                      <input
                        type="url"
                        value={profileForm.resume_url}
                        onChange={(e) => setProfileForm({ ...profileForm, resume_url: e.target.value })}
                        placeholder="https://drive.google.com/file/d/..."
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-70"
                      >
                        <Save className="w-4 h-4" />
                        <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan Profil'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ================= TAB 2: PROJECTS ================= */}
              {activeTab === 'projects' && (
                <div>
                  <div className="mb-6 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Kelola Project & Portofolio</h2>
                      <p className="text-xs sm:text-sm text-slate-500">
                        Tambah, perbarui, dan hapus karya/project beserta tautan Google Drive / situs eksternal.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingProject(true);
                        setEditingProject(null);
                        setProjectForm({ judul: '', deskripsi: '', gambar_url: '', link: '' });
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer w-fit"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Project Baru</span>
                    </button>
                  </div>

                  {/* Form Tambah/Edit Project */}
                  {(isAddingProject || editingProject) && (
                    <div className="mb-8 p-5 sm:p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                      <h3 className="text-base font-bold text-slate-900 mb-4">
                        {editingProject ? 'Edit Project' : 'Tambah Project Baru'}
                      </h3>

                      <form onSubmit={handleSaveProject} className="space-y-4">
                        <ImageUploader
                          label="Gambar Project (Bucket projects)"
                          bucket="projects"
                          currentImageUrl={projectForm.gambar_url}
                          onImageUploaded={(url) => setProjectForm({ ...projectForm, gambar_url: url })}
                        />

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Judul Project
                          </label>
                          <input
                            type="text"
                            value={projectForm.judul}
                            onChange={(e) => setProjectForm({ ...projectForm, judul: e.target.value })}
                            required
                            placeholder="Contoh: Kampanye Brand Komunikasi Kreatif"
                            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Deskripsi Project
                          </label>
                          <textarea
                            rows={3}
                            value={projectForm.deskripsi}
                            onChange={(e) => setProjectForm({ ...projectForm, deskripsi: e.target.value })}
                            required
                            placeholder="Jelaskan peran, hasil karya, atau dampak proyek..."
                            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white leading-relaxed"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Tautan Link Project (Internal/Eksternal/Google Drive)
                          </label>
                          <input
                            type="url"
                            value={projectForm.link}
                            onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                            placeholder="https://drive.google.com/... atau https://example.com"
                            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <button
                            type="submit"
                            disabled={saving}
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                          >
                            {saving ? 'Menyimpan...' : 'Simpan Project'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingProject(false);
                              setEditingProject(null);
                            }}
                            className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-xl transition-colors cursor-pointer"
                          >
                            Batal
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* List Project (Responsif & Touch Friendly) */}
                  <div className="space-y-3">
                    {data.projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-200 transition-colors gap-3"
                      >
                        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                          <div className="w-16 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                            <img
                              src={proj.gambar_url || 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=400&q=80'}
                              alt={proj.judul}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 truncate">
                              {proj.judul}
                            </h4>
                            <p className="text-xs text-slate-500 truncate max-w-md">
                              {proj.deskripsi}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProject(proj);
                              setProjectForm({
                                judul: proj.judul,
                                deskripsi: proj.deskripsi,
                                gambar_url: proj.gambar_url,
                                link: proj.link,
                              });
                              setIsAddingProject(false);
                            }}
                            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {data.projects.length === 0 && (
                      <p className="text-sm text-slate-500 text-center py-8">
                        Belum ada data project. Klik tombol di atas untuk menambahkan.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ================= TAB 3: SKILLS ================= */}
              {activeTab === 'skills' && (
                <div>
                  <div className="mb-6 pb-4 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Kelola Keahlian (Skills)</h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Sesuai PRD 3.2: Menampilkan nama keahlian saja tanpa indikator level.
                    </p>
                  </div>

                  {/* Form Tambah Skill */}
                  <form onSubmit={handleAddSkill} className="flex gap-2.5 mb-6">
                    <input
                      type="text"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      placeholder="Nama keahlian baru (contoh: Canva, Negosiasi, dsb)..."
                      className="flex-1 px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={saving || !newSkillName.trim()}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-60 shrink-0 inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah</span>
                    </button>
                  </form>

                  {/* List Skills */}
                  <div className="flex flex-wrap gap-2.5">
                    {data.skills.map((skill) => {
                      const isEditing = editingSkillId === skill.id;
                      return (
                        <div
                          key={skill.id}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-sm font-medium text-slate-800 transition-colors shadow-2xs"
                        >
                          {isEditing ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={editingSkillName}
                                onChange={(e) => setEditingSkillName(e.target.value)}
                                className="px-2 py-0.5 text-xs border border-blue-400 rounded-md focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveEditSkill(skill.id)}
                                className="text-emerald-600 hover:text-emerald-700 p-0.5 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingSkillId(null)}
                                className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <span>{skill.nama_skill}</span>
                              <div className="flex items-center gap-0.5 ml-1 border-l border-slate-200 pl-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingSkillId(skill.id);
                                    setEditingSkillName(skill.nama_skill);
                                  }}
                                  className="text-slate-400 hover:text-blue-600 p-1 cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSkill(skill.id)}
                                  className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ================= TAB 4: EXPERIENCES ================= */}
              {activeTab === 'experiences' && (
                <div>
                  <div className="mb-6 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Kelola Pengalaman Kerja</h2>
                      <p className="text-xs sm:text-sm text-slate-500">
                        Nama instansi, tahun kerja, lokasi, dan deskripsi singkat peran Anda.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingExp(true);
                        setEditingExp(null);
                        setExpForm({ nama_instansi: '', tahun: '', lokasi: '', deskripsi: '' });
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer w-fit"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Pengalaman</span>
                    </button>
                  </div>

                  {(isAddingExp || editingExp) && (
                    <div className="mb-8 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                      <h3 className="text-base font-bold text-slate-900 mb-4">
                        {editingExp ? 'Edit Pengalaman Kerja' : 'Tambah Pengalaman Kerja'}
                      </h3>

                      <form onSubmit={handleSaveExperience} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Nama Instansi / Perusahaan
                            </label>
                            <input
                              type="text"
                              value={expForm.nama_instansi}
                              onChange={(e) => setExpForm({ ...expForm, nama_instansi: e.target.value })}
                              required
                              placeholder="Nama instansi..."
                              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Tahun
                            </label>
                            <input
                              type="text"
                              value={expForm.tahun}
                              onChange={(e) => setExpForm({ ...expForm, tahun: e.target.value })}
                              required
                              placeholder="2023 - Sekarang"
                              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Lokasi
                          </label>
                          <input
                            type="text"
                            value={expForm.lokasi}
                            onChange={(e) => setExpForm({ ...expForm, lokasi: e.target.value })}
                            placeholder="Jakarta Selatan, Indonesia"
                            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Deskripsi Singkat
                          </label>
                          <textarea
                            rows={3}
                            value={expForm.deskripsi}
                            onChange={(e) => setExpForm({ ...expForm, deskripsi: e.target.value })}
                            required
                            placeholder="Tanggung jawab dan pencapaian..."
                            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <button
                            type="submit"
                            disabled={saving}
                            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                          >
                            Simpan Pengalaman
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingExp(false);
                              setEditingExp(null);
                            }}
                            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-xl transition-colors cursor-pointer"
                          >
                            Batal
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="space-y-3">
                    {data.experiences.map((exp) => (
                      <div
                        key={exp.id}
                        className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <h4 className="text-base font-bold text-slate-900">{exp.nama_instansi}</h4>
                            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                              {exp.tahun}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{exp.lokasi}</p>
                          <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-2">{exp.deskripsi}</p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 self-end sm:self-start">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingExp(exp);
                              setExpForm({
                                nama_instansi: exp.nama_instansi,
                                tahun: exp.tahun,
                                lokasi: exp.lokasi,
                                deskripsi: exp.deskripsi,
                              });
                              setIsAddingExp(false);
                            }}
                            className="p-2 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteExp(exp.id)}
                            className="p-2 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= TAB 5: COURSES ================= */}
              {activeTab === 'courses' && (
                <div>
                  <div className="mb-6 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Kelola Pelatihan & Course</h2>
                      <p className="text-xs sm:text-sm text-slate-500">
                        Nama course, penyelenggara, tahun, lokasi, dan deskripsi singkat.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCourse(true);
                        setEditingCourse(null);
                        setCourseForm({ nama_course: '', penyelenggara: '', tahun: '', lokasi: '', deskripsi: '' });
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer w-fit"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Pelatihan</span>
                    </button>
                  </div>

                  {(isAddingCourse || editingCourse) && (
                    <div className="mb-8 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                      <h3 className="text-base font-bold text-slate-900 mb-4">
                        {editingCourse ? 'Edit Pelatihan' : 'Tambah Pelatihan Baru'}
                      </h3>

                      <form onSubmit={handleSaveCourse} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Nama Course / Pelatihan
                            </label>
                            <input
                              type="text"
                              value={courseForm.nama_course}
                              onChange={(e) => setCourseForm({ ...courseForm, nama_course: e.target.value })}
                              required
                              placeholder="Nama pelatihan..."
                              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Penyelenggara
                            </label>
                            <input
                              type="text"
                              value={courseForm.penyelenggara}
                              onChange={(e) => setCourseForm({ ...courseForm, penyelenggara: e.target.value })}
                              required
                              placeholder="Penyelenggara..."
                              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Tahun
                            </label>
                            <input
                              type="text"
                              value={courseForm.tahun}
                              onChange={(e) => setCourseForm({ ...courseForm, tahun: e.target.value })}
                              placeholder="2024"
                              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Lokasi
                            </label>
                            <input
                              type="text"
                              value={courseForm.lokasi}
                              onChange={(e) => setCourseForm({ ...courseForm, lokasi: e.target.value })}
                              placeholder="Jakarta / Online"
                              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Deskripsi Singkat
                          </label>
                          <textarea
                            rows={3}
                            value={courseForm.deskripsi}
                            onChange={(e) => setCourseForm({ ...courseForm, deskripsi: e.target.value })}
                            placeholder="Materi yang dipelajari..."
                            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <button
                            type="submit"
                            disabled={saving}
                            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                          >
                            Simpan Pelatihan
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingCourse(false);
                              setEditingCourse(null);
                            }}
                            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-xl transition-colors cursor-pointer"
                          >
                            Batal
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="space-y-3">
                    {data.courses.map((crs) => (
                      <div
                        key={crs.id}
                        className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <h4 className="text-base font-bold text-slate-900">{crs.nama_course}</h4>
                            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                              {crs.tahun}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {crs.penyelenggara} • {crs.lokasi}
                          </p>
                          <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-2">{crs.deskripsi}</p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 self-end sm:self-start">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCourse(crs);
                              setCourseForm({
                                nama_course: crs.nama_course,
                                penyelenggara: crs.penyelenggara,
                                tahun: crs.tahun,
                                lokasi: crs.lokasi,
                                deskripsi: crs.deskripsi,
                              });
                              setIsAddingCourse(false);
                            }}
                            className="p-2 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCourse(crs.id)}
                            className="p-2 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= TAB 6: LANGUAGES ================= */}
              {activeTab === 'languages' && (
                <div>
                  <div className="mb-6 pb-4 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Kelola Kemampuan Bahasa</h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Format: Nama Bahasa — Level (contoh: "Bahasa Indonesia — Native"). Tanpa progress bar visual.
                    </p>
                  </div>

                  {/* Tambah Bahasa */}
                  <form onSubmit={handleAddLanguage} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 mb-6">
                    <input
                      type="text"
                      value={newLangName}
                      onChange={(e) => setNewLangName(e.target.value)}
                      placeholder="Nama Bahasa (contoh: Bahasa Jepang)..."
                      className="sm:col-span-6 px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={newLangLevel}
                      onChange={(e) => setNewLangLevel(e.target.value)}
                      placeholder="Level (contoh: Fluent, Intermediate)..."
                      className="sm:col-span-4 px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={saving || !newLangName.trim()}
                      className="sm:col-span-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-60 inline-flex items-center justify-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah</span>
                    </button>
                  </form>

                  {/* List Bahasa */}
                  <div className="space-y-2.5">
                    {data.languages.map((lang) => {
                      const isEditing = editingLangId === lang.id;
                      return (
                        <div
                          key={lang.id}
                          className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white"
                        >
                          {isEditing ? (
                            <div className="flex-1 flex gap-2">
                              <input
                                type="text"
                                value={editingLangForm.nama_bahasa}
                                onChange={(e) => setEditingLangForm({ ...editingLangForm, nama_bahasa: e.target.value })}
                                className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg"
                              />
                              <input
                                type="text"
                                value={editingLangForm.level}
                                onChange={(e) => setEditingLangForm({ ...editingLangForm, level: e.target.value })}
                                className="w-40 px-3 py-1.5 text-sm border border-slate-300 rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveEditLang(lang.id)}
                                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold"
                              >
                                Simpan
                              </button>
                            </div>
                          ) : (
                            <div>
                              <span className="font-semibold text-slate-900">{lang.nama_bahasa}</span>
                              <span className="text-slate-400 mx-2">—</span>
                              <span className="text-blue-700 font-medium">{lang.level}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-1">
                            {!isEditing && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingLangId(lang.id);
                                  setEditingLangForm({ nama_bahasa: lang.nama_bahasa, level: lang.level });
                                }}
                                className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteLanguage(lang.id)}
                              className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ================= TAB 7: CONTACTS ================= */}
              {activeTab === 'contacts' && (
                <div>
                  <div className="mb-6 pb-4 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Kelola Informasi Kontak</h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Tautan resmi menuju WhatsApp, Email, Instagram, dan LinkedIn.
                    </p>
                  </div>

                  {/* Tambah Kontak */}
                  <form onSubmit={handleAddContact} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 mb-6">
                    <select
                      value={newContactType}
                      onChange={(e) => setNewContactType(e.target.value as ContactType)}
                      className="sm:col-span-3 px-3 py-2.5 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="whatsapp">WhatsApp</option>
                      <option value="email">Email</option>
                      <option value="instagram">Instagram</option>
                      <option value="linkedin">LinkedIn</option>
                    </select>

                    <input
                      type="text"
                      value={newContactValue}
                      onChange={(e) => setNewContactValue(e.target.value)}
                      placeholder="Nomor WA (+62...), Email, atau URL..."
                      className="sm:col-span-7 px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                      type="submit"
                      disabled={saving || !newContactValue.trim()}
                      className="sm:col-span-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-60 inline-flex items-center justify-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah</span>
                    </button>
                  </form>

                  {/* List Kontak */}
                  <div className="space-y-3">
                    {data.contacts.map((cont) => {
                      const isEditing = editingContactId === cont.id;
                      return (
                        <div
                          key={cont.id}
                          className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider shrink-0">
                              {cont.tipe}
                            </span>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editingContactValue}
                                onChange={(e) => setEditingContactValue(e.target.value)}
                                className="px-3 py-1 text-sm border border-slate-300 rounded-lg"
                              />
                            ) : (
                              <span className="text-sm font-medium text-slate-800 truncate">
                                {cont.value}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 shrink-0 ml-2">
                            {isEditing ? (
                              <button
                                type="button"
                                onClick={() => handleSaveEditContact(cont.id)}
                                className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg"
                              >
                                Simpan
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingContactId(cont.id);
                                  setEditingContactValue(cont.value);
                                }}
                                className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteContact(cont.id)}
                              className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ================= TAB 8: SUPABASE & SQL ================= */}
              {activeTab === 'supabase' && (
                <div>
                  <div className="mb-6 pb-4 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Supabase & Database SQL</h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Hubungkan ke project Supabase dan jalankan skrip SQL untuk membuat seluruh tabel & bucket secara instan.
                    </p>
                  </div>

                  {/* Connection Status Card */}
                  <div className={`p-4 rounded-2xl border mb-6 ${
                    isSupabaseConfigured()
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-blue-50/60 border-blue-200 text-blue-950'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Database className="w-5 h-5 text-blue-600" />
                      <h4 className="font-bold text-sm">
                        Status Koneksi: {isSupabaseConfigured() ? 'Terhubung ke Supabase' : 'Mode Penyimpanan Mandiri'}
                      </h4>
                    </div>
                    <p className="text-xs leading-relaxed opacity-90">
                      {isSupabaseConfigured()
                        ? 'Website Anda terhubung ke database Postgres dan autentikasi Supabase. Perubahan data tersinkronisasi langsung.'
                        : 'Data disimpan dengan aman dan tersimpan di penyimpanan browser. Anda dapat menyambungkan Supabase URL & Anon Key kapan saja di bawah ini.'}
                    </p>
                  </div>

                  {/* Form Konfigurasi Supabase */}
                  <form onSubmit={handleSaveSbConfig} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 mb-8 space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">Kredensial Supabase (Opsional)</h3>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        SUPABASE PROJECT URL
                      </label>
                      <input
                        type="text"
                        value={sbUrl}
                        onChange={(e) => setSbUrl(e.target.value)}
                        placeholder="https://your-project.supabase.co"
                        className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        SUPABASE ANON / PUBLIC KEY
                      </label>
                      <input
                        type="text"
                        value={sbKey}
                        onChange={(e) => setSbKey(e.target.value)}
                        placeholder="eyJhbGciOi..."
                        className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan & Sambungkan Kredensial</span>
                    </button>
                  </form>

                  {/* Skema SQL DDL Generator (1-Click Copy) */}
                  <div className="border border-slate-200 rounded-2xl p-5 bg-white">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Skrip SQL Supabase Siap Pakai</h4>
                        <p className="text-xs text-slate-500">
                          Jalankan skrip ini di menu <strong>SQL Editor</strong> pada Supabase Dashboard Anda.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopySql}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors cursor-pointer w-fit"
                      >
                        {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedSql ? 'Berhasil Disalin!' : 'Salin Semua SQL'}</span>
                      </button>
                    </div>

                    <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto max-h-80 leading-relaxed">
                      {SUPABASE_SQL_SCHEMA}
                    </pre>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
