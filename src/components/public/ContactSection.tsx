import React from 'react';
import { Mail, MessageCircle, Instagram, Linkedin, ExternalLink } from 'lucide-react';
import { Contact, ContactType } from '../../types';

interface ContactSectionProps {
  contacts: Contact[];
}

function getContactMeta(tipe: ContactType, value: string): { label: string; href: string; icon: React.ReactNode; displayVal: string } {
  switch (tipe) {
    case 'whatsapp': {
      const cleanPhone = value.replace(/[^0-9]/g, '');
      const href = cleanPhone.startsWith('0')
        ? `https://wa.me/62${cleanPhone.slice(1)}`
        : `https://wa.me/${cleanPhone}`;
      return {
        label: 'WhatsApp',
        href: value.startsWith('http') ? value : href,
        icon: <MessageCircle className="w-5 h-5 text-emerald-600" />,
        displayVal: value,
      };
    }
    case 'email':
      return {
        label: 'Email',
        href: value.startsWith('mailto:') ? value : `mailto:${value}`,
        icon: <Mail className="w-5 h-5 text-blue-600" />,
        displayVal: value,
      };
    case 'instagram':
      return {
        label: 'Instagram',
        href: value.startsWith('http') ? value : `https://instagram.com/${value.replace('@', '')}`,
        icon: <Instagram className="w-5 h-5 text-pink-600" />,
        displayVal: value.startsWith('http') ? '@' + value.split('/').filter(Boolean).pop() : value,
      };
    case 'linkedin':
      return {
        label: 'LinkedIn',
        href: value.startsWith('http') ? value : `https://linkedin.com/in/${value}`,
        icon: <Linkedin className="w-5 h-5 text-blue-700" />,
        displayVal: value.startsWith('http') ? 'Profil LinkedIn' : value,
      };
    default:
      return {
        label: 'Kontak',
        href: value,
        icon: <Mail className="w-5 h-5 text-slate-600" />,
        displayVal: value,
      };
  }
}

export const ContactSection: React.FC<ContactSectionProps> = ({ contacts }) => {
  if (!contacts || contacts.length === 0) return null;

  return (
    <section id="kontak" className="py-14 sm:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <Mail className="w-3.5 h-3.5" />
            <span>Terhubung Bersama</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Hubungi Saya
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Silakan hubungi melalui saluran komunikasi resmi di bawah ini untuk berdiskusi, kolaborasi proyek, atau kemitraan.
          </p>
        </div>

        {/* List Link Kontak (WhatsApp, Email, Instagram, LinkedIn) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {contacts.map((contact) => {
            const meta = getContactMeta(contact.tipe, contact.value);
            return (
              <a
                key={contact.id}
                href={meta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:border-blue-500 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors shrink-0">
                    {meta.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      {meta.label}
                    </p>
                    <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                      {meta.displayVal}
                    </p>
                  </div>
                </div>

                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0 ml-2 transition-colors" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
