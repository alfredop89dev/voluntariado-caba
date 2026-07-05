"use client";

import Image from "next/image";
import { useState } from "react";

interface EventHeroImageProps {
  src?: string;
  title: string;
}

export function EventHeroImage({ src, title }: EventHeroImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return <div className="absolute inset-0 bg-navy" />;
  }

  return (
    <>
      <Image
        src={src}
        alt={title}
        fill
        className="object-cover"
        sizes="100vw"
        priority
        onError={() => setError(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />
    </>
  );
}
