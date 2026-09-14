export interface Profile {
  id: string;
  nama: string;
  tagline: string;
  deskripsi: string;
  status: string;
  foto_profil_url: string;
  resume_url: string; // Optional URL (Google Drive), if empty, resume button is hidden
  updated_at?: string;
}

export interface Skill {
  id: string;
  nama_skill: string;
  urutan: number;
}

export interface Project {
  id: string;
  judul: string;
  deskripsi: string;
  gambar_url: string;
  link: string;
  urutan: number;
}

export interface Experience {
  id: string;
  nama_instansi: string;
  tahun: string;
  lokasi: string;
  deskripsi: string;
  urutan: number;
}

export interface Course {
  id: string;
  nama_course: string;
  penyelenggara: string;
  tahun: string;
  lokasi: string;
  deskripsi: string;
  urutan: number;
}

export interface Language {
  id: string;
  nama_bahasa: string;
  level: string; // e.g. "Native", "Intermediate", "Fluent"
  urutan: number;
}

export type ContactType = 'whatsapp' | 'email' | 'instagram' | 'linkedin';

export interface Contact {
  id: string;
  tipe: ContactType;
  value: string;
  urutan: number;
}

export interface PortfolioData {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  experiences: Experience[];
  courses: Course[];
  languages: Language[];
  contacts: Contact[];
}
