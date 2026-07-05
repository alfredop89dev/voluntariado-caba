"use client";

import Image from "next/image";
import { useState } from "react";

interface CardImageProps {
  src?: string;
  title: string;
  sizes: string;
}

export function CardImage({ src, title, sizes }: CardImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="flex size-full items-center justify-center bg-gradient-to-br from-navy/5 via-white to-muted/20">
        <span className="select-none text-[clamp(3rem,8vw,5rem)] font-bold text-muted/30">
          {title.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={title}
      fill
      className="object-cover transition-all duration-500 group-hover:scale-105"
      sizes={sizes}
      onError={() => setError(true)}
    />
  );
}
