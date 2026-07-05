"use client";

import { motion } from "motion/react";
import { useI18n } from "@/lib/i18n/translations-context";

const starPath = "M0,-5 L1.5,-1.5 L5,-1.5 L2.5,1 L3.5,5 L0,2.5 L-3.5,5 L-2.5,1 L-5,-1.5 L-1.5,-1.5 Z";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const starItem = {
  hidden: { opacity: 0, scale: 0, rotate: -45 },
  show: { opacity: 0.35, scale: 1, rotate: 0 },
};

export function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-navy px-6 sm:min-h-[80dvh] lg:min-h-[70dvh]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(248,112,96,0.06)_0%,transparent_60%)]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-2xl text-center"
      >
        <motion.p
          variants={item}
          className="mb-5 text-xs font-medium text-coral uppercase tracking-[0.25em]"
        >
          {t("hero.badge")}
        </motion.p>
        <motion.h1
          variants={item}
          className="mb-6 text-4xl font-light leading-tight text-white sm:text-5xl lg:text-6xl"
        >
          {t("hero.title")}
        </motion.h1>
        <motion.p
          variants={item}
          className="mx-auto max-w-md text-base font-light leading-relaxed text-muted/70"
        >
          {t("hero.description")}
        </motion.p>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.7 } },
          }}
          initial="hidden"
          animate="show"
          className="mt-12 flex items-center justify-center gap-2"
        >
          {[...Array(8)].map((_, i) => (
            <motion.svg
              key={i}
              variants={starItem}
              viewBox="-5 -5 10 10"
              width={16}
              height={16}
              className="text-white"
              fill="currentColor"
              style={{ animation: `float ${2 + i * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}
            >
              <path d={starPath} />
            </motion.svg>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
