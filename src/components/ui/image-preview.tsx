"use client";

import Image from "next/image";
import { useState } from "react";

export function ImagePreview({ url }: { url: string }) {
  const [error, setError] = useState(false);

  if (!url || !url.startsWith("http")) return null;

  return (
    <div className="relative mt-2 aspect-video w-full overflow-hidden rounded-xl border border-muted/30 bg-muted/10">
      {error ? (
        <div className="flex size-full items-center justify-center text-xs text-taupe">
          No se pudo cargar la imagen
        </div>
      ) : (
        <Image
          src={url}
          alt="Preview"
          fill
          className="object-cover"
          sizes="400px"
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}
