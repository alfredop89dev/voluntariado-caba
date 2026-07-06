"use client";

import { Globe, Mail, Camera, MessageCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n/translations-context";

export function Footer() {
  const { t } = useI18n();
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  return (
    <footer className="bg-navy-dark">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-coral/15">
                <Globe size={20} className="text-coral" />
              </div>
              <span className="text-sm font-semibold tracking-wide text-white">
                {t("site.title")}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-white/40">
              {t("footer.description")}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-semibold tracking-[0.2em] text-coral uppercase">
              {t("footer.links_title")}
            </h4>
            <ul className="space-y-3">
              <li>
                <a href={`#${"calendario"}`} className="text-sm text-white/50 transition-colors duration-200 hover:text-white">
                  {t("nav.calendario")}
                </a>
              </li>
              <li>
                <a href={`#${"voluntariado"}`} className="text-sm text-white/50 transition-colors duration-200 hover:text-white">
                  {t("nav.voluntariado")}
                </a>
              </li>
              <li>
                <a href={`#${"donaciones"}`} className="text-sm text-white/50 transition-colors duration-200 hover:text-white">
                  {t("nav.donaciones")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-semibold tracking-[0.2em] text-coral uppercase">
              {t("footer.contact_title")}
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:redvoluntariosba@gmail.com"
                  className="flex items-center gap-2.5 text-sm text-white/50 transition-colors duration-200 hover:text-white"
                >
                  <Mail size={14} className="text-coral/60" />
                  {t("footer.email")}
                </a>
              </li>
              {whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-white/50 transition-colors duration-200 hover:text-white"
                  >
                    <MessageCircle size={14} className="text-coral/60" />
                    {t("footer.whatsapp")}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-semibold tracking-[0.2em] text-coral uppercase">
              {t("footer.follow_us")}
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://instagram.com/redvoluntarioscaba"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-white/50 transition-colors duration-200 hover:text-white"
                >
                  <Camera size={14} className="text-coral/60" />
                  Instagram
                </a>
              </li>
              {whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-coral/70 transition-colors duration-200 hover:text-coral"
                  >
                    <MessageCircle size={14} />
                    {t("footer.whatsapp")}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/5 pt-8">
          <p className="text-center text-xs text-white/30">
            &copy; {new Date().getFullYear()} {t("site.title")}. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
