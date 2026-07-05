"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";

interface EventShareProps {
  title: string;
  description?: string;
  phone?: string;
  url: string;
}

export function EventShare({ title, description, phone, url }: EventShareProps) {
  const [copied, setCopied] = useState(false);

  const text = `${title}${description ? ` — ${description}` : ""}`;
  const whatsappUrl = phone
    ? `https://wa.me/${phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(`${text}\n${url}`)}`
    : `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({ title, text, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartir por WhatsApp"
      >
        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
        </svg>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        aria-label="Compartir evento"
      >
        {copied ? <Check size={16} className="text-green-500" /> : <Share2 size={16} />}
      </Button>
    </div>
  );
}
