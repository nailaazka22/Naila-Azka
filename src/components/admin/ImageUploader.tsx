import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Check, Loader2, Link2 } from 'lucide-react';
import { uploadImageToBucket } from '../../services/portfolioService';

interface ImageUploaderProps {
  currentImageUrl: string;
  bucket: 'avatars' | 'projects';
  onImageUploaded: (url: string) => void;
  label?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  bucket,
  onImageUploaded,
  label = 'Upload Gambar',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl);
  const [useUrlInput, setUseUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar yang valid (JPG, PNG, WebP).');
      return;
    }

    setUploading(true);
    try {
      // Local immediate preview
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      // Upload to Supabase Storage / base64 fallback
      const finalUrl = await uploadImageToBucket(file, bucket);
      setPreviewUrl(finalUrl);
      onImageUploaded(finalUrl);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Gagal mengunggah gambar. Silakan coba lagi.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleApplyUrl = () => {
    if (!customUrl.trim()) return;
    setPreviewUrl(customUrl.trim());
    onImageUploaded(customUrl.trim());
    setUseUrlInput(false);
    setCustomUrl('');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setUseUrlInput(!useUrlInput)}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 cursor-pointer"
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>{useUrlInput ? 'Unggah File' : 'Gunakan Tautan URL'}</span>
        </button>
      </div>

      {useUrlInput ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://example.com/gambar.jpg"
            className="flex-1 px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Terapkan
          </button>
        </div>
      ) : (
        /* Drag and Drop Zone */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50/50'
              : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-white'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          <div className="flex flex-col items-center justify-center gap-2">
            {uploading ? (
              <div className="flex flex-col items-center gap-2 text-blue-600">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-xs font-medium text-slate-600">Mengunggah gambar...</span>
              </div>
            ) : (
              <>
                <div className="p-3 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Klik untuk memilih atau seret gambar ke sini
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Mendukung JPG, PNG, atau WebP (Bucket: <span className="font-mono text-blue-600 font-semibold">{bucket}</span>)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Preview Gambar */}
      {previewUrl && (
        <div className="flex items-center gap-3.5 p-2.5 rounded-xl border border-slate-200 bg-white">
          <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
            <img
              src={previewUrl}
              alt="Pratinjau"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-800 inline-flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Pratinjau Gambar Aktif
            </p>
            <p className="text-xs text-slate-500 truncate mt-0.5">{previewUrl}</p>
          </div>
        </div>
      )}
    </div>
  );
};
