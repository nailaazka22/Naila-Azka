import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Contact,
  Course,
  Experience,
  Language,
  PortfolioData,
  Profile,
  Project,
  Skill,
} from '../types';
import { defaultPortfolioData } from '../data/defaultData';

const LOCAL_STORAGE_KEY = 'portfolio_data_v1';
const AUTH_SESSION_KEY = 'portfolio_admin_session';

function getLocalData(): PortfolioData {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        profile: { ...defaultPortfolioData.profile, ...(parsed.profile || {}) },
        skills: Array.isArray(parsed.skills) ? parsed.skills : defaultPortfolioData.skills,
        projects: Array.isArray(parsed.projects) ? parsed.projects : defaultPortfolioData.projects,
        experiences: Array.isArray(parsed.experiences) ? parsed.experiences : defaultPortfolioData.experiences,
        courses: Array.isArray(parsed.courses) ? parsed.courses : defaultPortfolioData.courses,
        languages: Array.isArray(parsed.languages) ? parsed.languages : defaultPortfolioData.languages,
        contacts: Array.isArray(parsed.contacts) ? parsed.contacts : defaultPortfolioData.contacts,
      };
    }
  } catch (err) {
    console.error('Error reading localStorage portfolio data:', err);
  }
  return defaultPortfolioData;
}

function saveLocalData(data: PortfolioData): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving localStorage portfolio data:', err);
  }
}

export async function getPortfolioData(): Promise<PortfolioData> {
  const supabase = getSupabase();

  if (!supabase || !isSupabaseConfigured()) {
    return getLocalData();
  }

  try {
    const [
      profileRes,
      skillsRes,
      projectsRes,
      expRes,
      coursesRes,
      langRes,
      contactsRes,
    ] = await Promise.all([
      supabase.from('profile').select('*').limit(1).maybeSingle(),
      supabase.from('skills').select('*').order('urutan', { ascending: true }),
      supabase.from('projects').select('*').order('urutan', { ascending: true }),
      supabase.from('experiences').select('*').order('urutan', { ascending: true }),
      supabase.from('courses').select('*').order('urutan', { ascending: true }),
      supabase.from('languages').select('*').order('urutan', { ascending: true }),
      supabase.from('contacts').select('*').order('urutan', { ascending: true }),
    ]);

    const localFallback = getLocalData();

    const profile: Profile = profileRes.data && profileRes.data.nama
      ? {
          id: profileRes.data.id || 'main-profile',
          nama: profileRes.data.nama,
          tagline: profileRes.data.tagline || '',
          deskripsi: profileRes.data.deskripsi || '',
          status: profileRes.data.status || 'Terbuka untuk Kolaborasi',
          foto_profil_url: profileRes.data.foto_profil_url || '',
          resume_url: profileRes.data.resume_url || '',
          updated_at: profileRes.data.updated_at,
        }
      : localFallback.profile;

    const skills: Skill[] = (skillsRes.data && skillsRes.data.length > 0)
      ? skillsRes.data
      : localFallback.skills;

    const projects: Project[] = (projectsRes.data && projectsRes.data.length > 0)
      ? projectsRes.data
      : localFallback.projects;

    const experiences: Experience[] = (expRes.data && expRes.data.length > 0)
      ? expRes.data
      : localFallback.experiences;

    const courses: Course[] = (coursesRes.data && coursesRes.data.length > 0)
      ? coursesRes.data
      : localFallback.courses;

    const languages: Language[] = (langRes.data && langRes.data.length > 0)
      ? langRes.data
      : localFallback.languages;

    const contacts: Contact[] = (contactsRes.data && contactsRes.data.length > 0)
      ? contactsRes.data
      : localFallback.contacts;

    const merged: PortfolioData = {
      profile,
      skills,
      projects,
      experiences,
      courses,
      languages,
      contacts,
    };

    saveLocalData(merged);
    return merged;
  } catch (err) {
    console.warn('Supabase fetch failed, falling back to local data:', err);
    return getLocalData();
  }
}

// ----------------- PROFILE -----------------
export async function updateProfile(updated: Partial<Profile>): Promise<Profile> {
  const current = getLocalData();
  const newProfile: Profile = {
    ...current.profile,
    ...updated,
    updated_at: new Date().toISOString(),
  };

  current.profile = newProfile;
  saveLocalData(current);

  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('profile').upsert({
        id: 'main-profile',
        nama: newProfile.nama,
        tagline: newProfile.tagline,
        deskripsi: newProfile.deskripsi,
        status: newProfile.status,
        foto_profil_url: newProfile.foto_profil_url,
        resume_url: newProfile.resume_url || '',
        updated_at: newProfile.updated_at,
      });
    } catch (err) {
      console.error('Supabase profile update error:', err);
    }
  }

  return newProfile;
}

// ----------------- SKILLS -----------------
export async function addSkill(nama_skill: string): Promise<Skill> {
  const current = getLocalData();
  const newSkill: Skill = {
    id: 'skill-' + Date.now(),
    nama_skill: nama_skill.trim(),
    urutan: current.skills.length + 1,
  };
  current.skills.push(newSkill);
  saveLocalData(current);

  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('skills').insert(newSkill);
    } catch (err) {
      console.error('Supabase add skill error:', err);
    }
  }

  return newSkill;
}

export async function updateSkill(id: string, nama_skill: string): Promise<void> {
  const current = getLocalData();
  current.skills = current.skills.map((s) => (s.id === id ? { ...s, nama_skill: nama_skill.trim() } : s));
  saveLocalData(current);

  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('skills').update({ nama_skill: nama_skill.trim() }).eq('id', id);
    } catch (err) {
      console.error('Supabase update skill error:', err);
    }
  }
}

export async function deleteSkill(id: string): Promise<void> {
  const current = getLocalData();
  current.skills = current.skills.filter((s) => s.id !== id);
  saveLocalData(current);

  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('skills').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase delete skill error:', err);
    }
  }
}

// ----------------- PROJECTS -----------------
export async function addProject(project: Omit<Project, 'id' | 'urutan'>): Promise<Project> {
  const current = getLocalData();
  const newProject: Project = {
    ...project,
    id: 'proj-' + Date.now(),
    urutan: current.projects.length + 1,
  };
  current.projects.push(newProject);
  saveLocalData(current);

  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('projects').insert(newProject);
    } catch (err) {
      console.error('Supabase add project error:', err);
    }
  }

  return newProject;
}

export async function updateProject(id: string, patch: Partial<Project>): Promise<void> {
  const current = getLocalData();
  current.projects = current.projects.map((p) => (p.id === id ? { ...p, ...patch } : p));
  saveLocalData(current);

  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('projects').update(patch).eq('id', id);
    } catch (err) {
      console.error('Supabase update project error:', err);
    }
  }
}

export async function deleteProject(id: string): Promise<void> {
  const current = getLocalData();
  current.projects = current.projects.filter((p) => p.id !== id);
  saveLocalData(current);

  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('projects').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase delete project error:', err);
    }
  }
}

// ----------------- EXPERIENCES -----------------
export async function addExperience(exp: Omit<Experience, 'id' | 'urutan'>): Promise<Experience> {
  const current = getLocalData();
  const newExp: Experience = {
    ...exp,
    id: 'exp-' + Date.now(),
    urutan: current.experiences.length + 1,
  };
  current.experiences.push(newExp);
  saveLocalData(current);

  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('experiences').insert(newExp);
    } catch (err) {
      console.error('Supabase add experience error:', err);
    }
  }

  return newExp;
}

export async function updateExperience(id: string, patch: Partial<Experience>): Promise<void> {
  const current = getLocalData();
  current.experiences = current.experiences.map((e) => (e.id === id ? { ...e, ...patch } : e));
  saveLocalData(current);

  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('experiences').update(patch).eq('id', id);
    } catch (err) {
      console.error('Supabase update experience error:', err);
    }
  }
}

export async function deleteExperience(id: string): Promise<void> {
  const current = getLocalData();
  current.experiences = current.experiences.filter((e) => e.id !== id);
  saveLocalData(current);

  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('experiences').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase delete experience error:', err);
    }
  }
}

// ----------------- COURSES -----------------
export async function addCourse(crs: Omit<Course, 'id' | 'urutan'>): Promise<Course> {
  const current = getLocalData();
  const newCrs: Course = {
    ...crs,
    id: 'crs-' + Date.now(),
    urutan: current.courses.length + 1,
  };
  current.courses.push(newCrs);
  saveLocalData(current);

  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('courses').insert(newCrs);
    } catch (err) {
      console.error('Supabase add course error:', err);
    }
  }

  return newCrs;
}

export async function updateCourse(id: string, patch: Partial<Course>): Promise<void> {
  const current = getLocalData();
  current.courses = current.courses.map((c) => (c.id === id ? { ...c, ...patch } : c));
  saveLocalData(current);

  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('courses').update(patch).eq('id', id);
    } catch (err) {
      console.error('Supabase update course error:', err);
    }
  }
}

export async function deleteCourse(id: string): Promise<void> {
  const current = getLocalData();
  current.courses = current.courses.filter((c) => c.id !== id);
  saveLocalData(current);

  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('courses').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase delete course error:', err);
    }
  }
}

// ----------------- LANGUAGES -----------------
export async function addLanguage(lang: Omit<Language, 'id' | 'urutan'>): Promise<Language> {
  const current = getLocalData();
  const newLang: Language = {
    ...lang,
    id: 'lang-' + Date.now(),
    urutan: current.languages.length + 1,
  };
  current.languages.push(newLang);
  saveLocalData(current);

  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('languages').insert(newLang);
    } catch (err) {
      console.error('Supabase add language error:', err);
    }
  }

  return newLang;
}

export async function updateLanguage(id: string, patch: Partial<Language>): Promise<void> {
  const current = getLocalData();
  current.languages = current.languages.map((l) => (l.id === id ? { ...l, ...patch } : l));
  saveLocalData(current);

  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('languages').update(patch).eq('id', id);
    } catch (err) {
      console.error('Supabase update language error:', err);
    }
  }
}

export async function deleteLanguage(id: string): Promise<void> {
  const current = getLocalData();
  current.languages = current.languages.filter((l) => l.id !== id);
  saveLocalData(current);

  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('languages').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase delete language error:', err);
    }
  }
}

// ----------------- CONTACTS -----------------
export async function addContact(contact: Omit<Contact, 'id' | 'urutan'>): Promise<Contact> {
  const current = getLocalData();
  const newContact: Contact = {
    ...contact,
    id: 'cont-' + Date.now(),
    urutan: current.contacts.length + 1,
  };
  current.contacts.push(newContact);
  saveLocalData(current);

  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('contacts').insert(newContact);
    } catch (err) {
      console.error('Supabase add contact error:', err);
    }
  }

  return newContact;
}

export async function updateContact(id: string, patch: Partial<Contact>): Promise<void> {
  const current = getLocalData();
  current.contacts = current.contacts.map((c) => (c.id === id ? { ...c, ...patch } : c));
  saveLocalData(current);

  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('contacts').update(patch).eq('id', id);
    } catch (err) {
      console.error('Supabase update contact error:', err);
    }
  }
}

export async function deleteContact(id: string): Promise<void> {
  const current = getLocalData();
  current.contacts = current.contacts.filter((c) => c.id !== id);
  saveLocalData(current);

  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('contacts').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase delete contact error:', err);
    }
  }
}

// ----------------- STORAGE UPLOAD (PRD Section 5) -----------------
export async function uploadImageToBucket(file: File, bucket: 'avatars' | 'projects'): Promise<string> {
  const supabase = getSupabase();

  if (supabase && isSupabaseConfigured()) {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

      if (!uploadError) {
        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        if (data?.publicUrl) {
          return data.publicUrl;
        }
      } else {
        console.warn('Supabase storage upload error, falling back to data URL:', uploadError);
      }
    } catch (err) {
      console.warn('Storage upload exception, falling back to data URL:', err);
    }
  }

  // Fallback: Read file as Data URL (allows preview and offline storage)
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

// ----------------- AUTHENTICATION (PRD Section 4.1) -----------------
export interface AuthUser {
  email: string;
  id?: string;
  source: 'supabase' | 'local_session';
}

export async function signInAdmin(email: string, password: string): Promise<{ user: AuthUser | null; error: string | null }> {
  const supabase = getSupabase();

  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data?.user) {
        const authUser: AuthUser = {
          email: data.user.email || email,
          id: data.user.id,
          source: 'supabase',
        };
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(authUser));
        return { user: authUser, error: null };
      }
    } catch (err: any) {
      return { user: null, error: err.message || 'Terjadi kesalahan autentikasi Supabase' };
    }
  }

  // Fallback testing session if Supabase credentials have not yet been plugged in
  if (!email || !password) {
    return { user: null, error: 'Email dan kata sandi wajib diisi' };
  }

  const authUser: AuthUser = {
    email,
    id: 'admin-' + Date.now(),
    source: 'local_session',
  };
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(authUser));
  return { user: authUser, error: null };
}

export async function signOutAdmin(): Promise<void> {
  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Supabase sign out error:', err);
    }
  }
  localStorage.removeItem(AUTH_SESSION_KEY);
}

export async function getCurrentAdminSession(): Promise<AuthUser | null> {
  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        return {
          email: data.session.user.email || '',
          id: data.session.user.id,
          source: 'supabase',
        };
      }
    } catch (err) {
      console.error('Error fetching Supabase session:', err);
    }
  }

  try {
    const localSession = localStorage.getItem(AUTH_SESSION_KEY);
    if (localSession) {
      return JSON.parse(localSession);
    }
  } catch (err) {
    console.error('Error parsing local admin session:', err);
  }

  return null;
}
