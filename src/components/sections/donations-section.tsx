"use client";

import { motion } from "motion/react";
import { FadeIn } from "@/components/ui/fade-in";
import { Button } from "@/components/ui/button";

const DONATIONS_URL = process.env.NEXT_PUBLIC_DONATIONS_URL ?? "#";

export function DonationsSection() {
  return (
    <section id="donaciones" className="relative overflow-hidden bg-white px-6 py-24 sm:py-32">
      <div className="absolute -top-24 left-1/2 size-96 -translate-x-1/2 rounded-full bg-coral/3 blur-3xl" />

      <div className="relative mx-auto max-w-xl text-center">
        <FadeIn>
          <p className="mb-3 text-xs font-medium text-coral uppercase tracking-[0.2em]">
            Donaciones
          </p>
          <h2 className="mb-4 text-3xl font-light text-navy sm:text-4xl">
            Tu aporte <span className="font-semibold">importa</span>
          </h2>
          <p className="mb-10 text-sm font-light leading-relaxed text-taupe">
            Tu contribución es fundamental para ayudar a las víctimas del terremoto.
            Cada donación, por pequeña que sea, marca una gran diferencia.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <motion.a
            href={DONATIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block"
          >
            <Button variant="secondary" size="lg">
              Quiero donar
            </Button>
          </motion.a>
        </FadeIn>
      </div>
    </section>
  );
}
