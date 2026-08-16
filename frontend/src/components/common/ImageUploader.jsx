'use client';

import { useRef, useState } from 'react';
import { Upload, X, Loader2, ImageOff } from 'lucide-react';
import { uploadFile, validateFile, deleteFile } from '@/lib/imagekit';

/**
 * Multi-image uploader backed directly by ImageKit's client-side upload (the
 * browser talks to ImageKit directly using a short-lived signature from
 * /api/imagekit/auth — files never round-trip through this server).
 *
 * `value` / `onChange` carry a plain array of URL strings, matching how
 * images are persisted on both Service and Enquiry documents. `fileId`s
 * (needed to delete from ImageKit, not just unlink locally) are tracked in
 * local component state only, keyed by URL.
 */
export default function ImageUploader({
  value = [],
  onChange,
  folder = 'homecare',
  maxFiles = 6,
  maxSizeMB = 5,
  label = 'Upload images',
  helpText,
}) {
  const [fileIdByUrl, setFileIdByUrl] = useState({});
  const [pending, setPending] = useState([]); // in-flight local preview names
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const remainingSlots = Math.max(maxFiles - value.length, 0);

  async function handleFiles(fileList) {
    const files = Array.from(fileList || []).slice(0, remainingSlots);
    if (!files.length) return;
    setError('');

    for (const file of files) {
      const validation = validateFile(file, { maxSize: maxSizeMB * 1024 * 1024 });
      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        continue;
      }

      setPending((p) => [...p, file.name]);
      try {
        const result = await uploadFile(file, folder);
        setFileIdByUrl((m) => ({ ...m, [result.url]: result.fileId }));
        onChange([...value, result.url]);
      } catch (err) {
        setError(`Upload failed: ${err.message || 'Unknown error'}`);
      } finally {
        setPending((p) => p.filter((n) => n !== file.name));
      }
    }
  }

  async function handleRemove(url) {
    onChange(value.filter((u) => u !== url));
    const fileId = fileIdByUrl[url];
    // Best-effort cleanup — the image is already unlinked locally either way,
    // so a failed ImageKit delete (e.g. this URL was uploaded in a previous
    // session and we never learned its fileId) shouldn't block removal.
    if (fileId) {
      deleteFile(fileId).catch(() => {});
    }
  }

  return (
    <div className="space-y-2">
      {(value.length > 0 || pending.length > 0) && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {value.map((url) => (
            <div key={url} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute top-1 right-1 p-1 bg-slate-900/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {pending.map((name) => (
            <div key={name} className="aspect-square rounded-lg border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
            </div>
          ))}
        </div>
      )}

      {remainingSlots > 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 py-6 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-colors"
        >
          <Upload className="w-4 h-4" /> {label}
        </button>
      ) : (
        <p className="flex items-center gap-1.5 text-xs text-slate-400 py-2">
          <ImageOff className="w-3.5 h-3.5" /> Maximum {maxFiles} images reached
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={remainingSlots > 1}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {helpText && !error && <p className="text-xs text-slate-400">{helpText}</p>}
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}
