"use client";

import { useI18n } from "@/lib/i18n/translations-context";
import { LOCALES, type Locale } from "@/lib/i18n/config";

const FLAGS: Record<Locale, string> = {
  es: "🇪🇸",
  en: "🇺🇸",
};

export function LocaleSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center gap-1">
      {LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={`cursor-pointer rounded-lg px-2 py-1 text-xs font-medium transition-all duration-200 ${
            locale === l
              ? "bg-white/20 text-white"
              : "text-white/50 hover:bg-white/10 hover:text-white/80"
          }`}
          title={l === "es" ? "Español" : "English"}
        >
          {FLAGS[l]}
        </button>
      ))}
    </div>
  );
}
