"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
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
        <MessageCircle size={16} />
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
