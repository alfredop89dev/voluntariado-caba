"use client";

import { motion } from "motion/react";
import { FadeIn } from "@/components/ui/fade-in";
import { VolunteerForm } from "@/components/sections/volunteer-form";
import { Button } from "@/components/ui/button";

const EXTERNAL_URL = process.env.NEXT_PUBLIC_VOLUNTEER_FORM_URL;

export function VolunteerSection() {
  return (
    <section id="voluntariado" className="bg-navy px-6 py-24">
      <div className="mx-auto max-w-xl">
        <FadeIn>
          <p className="mb-2 text-center text-xs font-medium text-coral uppercase tracking-[0.2em]">
            Voluntariado
          </p>
          <h2 className="mb-4 text-center text-3xl font-light text-white sm:text-4xl">
            Sé parte del <span className="font-semibold">cambio</span>
          </h2>
          <p className="mb-10 text-center text-sm font-light leading-relaxed text-muted/70">
            {EXTERNAL_URL
              ? "Completá el formulario externo para unirte a nuestra red de voluntarios."
              : "Completa el formulario y únete a nuestra red de voluntarios. Tu tiempo y dedicación pueden transformar vidas."}
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
                Ir al formulario de inscripción
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
