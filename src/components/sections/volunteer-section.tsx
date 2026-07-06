"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { FadeIn } from "@/components/ui/fade-in";
import { VolunteerForm } from "@/components/sections/volunteer-form";
import { useI18n } from "@/lib/i18n/translations-context";

export function VolunteerSection() {
  const { t } = useI18n();
  const externalFormUrl = process.env.NEXT_PUBLIC_VOLUNTEER_FORM_URL;

  return (
    <section id="voluntariado" className="bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
          <FadeIn>
            <div className="lg:sticky lg:top-24">
              <span className="mb-4 inline-block text-[11px] font-semibold tracking-[0.2em] text-coral uppercase">
                {t("volunteer.badge")}
              </span>
              <h2 className="text-3xl font-light leading-tight text-navy sm:text-4xl">
                {t("volunteer.title")}{" "}
                <span className="font-semibold">{t("volunteer.title_accent")}</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed">
                {t("volunteer.description")}
              </p>

              {externalFormUrl && (
                <motion.div
                  className="mt-8"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={externalFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-coral px-6 py-3 text-sm font-medium text-white shadow-xs shadow-coral/20 transition-all duration-200 hover:bg-coral/90 hover:shadow-sm hover:shadow-coral/25"
                  >
                    {t("volunteer.external_cta")}
                    <ArrowRight size={14} />
                  </Link>
                </motion.div>
              )}
            </div>
          </FadeIn>

          {!externalFormUrl && (
            <FadeIn delay={0.15}>
              <div className="rounded-xl border border-muted/15 bg-white p-6 shadow-xs sm:p-8">
                <VolunteerForm />
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  );
}
