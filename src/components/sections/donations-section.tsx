"use client";

import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { FadeIn } from "@/components/ui/fade-in";
import { useI18n } from "@/lib/i18n/translations-context";

export function DonationsSection() {
  const { t } = useI18n();
  const donationUrl = process.env.NEXT_PUBLIC_DONATIONS_URL;

  if (!donationUrl) return null;

  return (
    <section id="donaciones" className="relative overflow-hidden bg-navy px-6 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(248,112,96,0.08)_0%,_transparent_60%)]" />

      <div className="relative mx-auto max-w-2xl text-center">
        <FadeIn>
          <div className="mb-6 inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
            <Heart size={12} className="text-coral" />
            <span className="text-[11px] font-medium tracking-[0.2em] text-white/60 uppercase">
              {t("donations.title")}
            </span>
          </div>

          <h2 className="text-3xl font-light leading-tight text-white sm:text-4xl">
            {t("donations.title")}
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/50">
            {t("donations.description")}
          </p>

          <motion.div
            className="mt-8"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <a
              href={donationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-coral px-8 py-3 text-sm font-medium text-white shadow-lg shadow-coral/25 transition-all duration-200 hover:bg-coral/90 hover:shadow-xl hover:shadow-coral/30"
            >
              <Heart size={14} />
              {t("donations.cta")}
            </a>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
