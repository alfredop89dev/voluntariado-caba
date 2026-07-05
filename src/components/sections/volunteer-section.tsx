"use client";

import { motion } from "motion/react";
import { FadeIn } from "@/components/ui/fade-in";
import { VolunteerForm } from "@/components/sections/volunteer-form";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/translations-context";

const EXTERNAL_URL = process.env.NEXT_PUBLIC_VOLUNTEER_FORM_URL;

export function VolunteerSection() {
  const { t } = useI18n();

  return (
    <section id="voluntariado" className="bg-navy px-6 py-24">
      <div className="mx-auto max-w-xl">
        <FadeIn>
          <p className="mb-2 text-center text-xs font-medium text-coral uppercase tracking-[0.2em]">
            {t("volunteer.badge")}
          </p>
          <h2 className="mb-4 text-center text-3xl font-light text-white sm:text-4xl">
            {t("volunteer.title")} <span className="font-semibold">{t("volunteer.title_accent")}</span>
          </h2>
          <p className="mb-10 text-center text-sm font-light leading-relaxed text-muted/70">
            {t("volunteer.description")}
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          {EXTERNAL_URL ? (
            <motion.a
              href={EXTERNAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="block"
            >
              <Button variant="secondary" size="lg" className="w-full">
                {t("volunteer.external_cta")}
              </Button>
            </motion.a>
          ) : (
            <VolunteerForm />
          )}
        </FadeIn>
      </div>
    </section>
  );
}
