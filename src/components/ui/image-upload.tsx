"use client";

import { useState, useRef } from "react";
import { CheckCircle2, Upload } from "lucide-react";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    return null;
  }

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData },
      );
      const data = await res.json();
      if (data.secure_url) {
        onChange(data.secure_url);
      }
    } catch {
      /* silent */
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <p className="text-xs font-semibold text-navy uppercase tracking-[0.15em]">{label}</p>
      )}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all duration-200 ${
          dragOver
            ? "border-coral bg-coral/5"
            : "border-muted/40 hover:border-muted/60 hover:bg-muted/10"
        }`}
      >
        {uploading ? (
          <div className="flex items-center gap-2 text-xs text-taupe">
            <div className="size-4 animate-spin rounded-full border-2 border-taupe/30 border-t-coral" />
            Subiendo...
          </div>
        ) : value ? (
          <div className="flex items-center gap-2 text-xs text-taupe">
            <CheckCircle2 size={16} className="shrink-0 text-green-500" />
            <span className="truncate max-w-[200px]">{value}</span>
          </div>
        ) : (
          <>
            <Upload size={24} className="mb-2 text-taupe/50" />
            <p className="text-xs text-taupe/70">Hacé clic o arrastrá una imagen</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
    </div>
  );
}
