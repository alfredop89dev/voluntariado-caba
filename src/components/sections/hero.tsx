"use client";

import { motion } from "motion/react";
import { useI18n } from "@/lib/i18n/translations-context";

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(42);

const stars = Array.from({ length: 8 }, (_, i) => ({
  top: `${10 + rng() * 80}%`,
  left: `${5 + rng() * 90}%`,
  size: 12 + rng() * 16,
  delay: i * 0.15,
}));

export function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative flex min-h-[90dvh] items-center justify-center overflow-hidden bg-navy px-6 sm:min-h-[85dvh]">

      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute text-white/20"
          style={{ top: star.top, left: star.left }}
          initial={{ opacity: 0, scale: 0, rotate: -45 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.7 + star.delay, duration: 0.6, ease: "easeOut" }}
        >
          <svg
            width={star.size}
            height={star.size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="animate-[float_3s_ease-in-out_infinite]"
            style={{ animationDelay: `${star.delay}s` }}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </motion.div>
      ))}

      <motion.div
        className="relative z-10 mx-auto max-w-3xl text-center"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
        }}
      >
        <motion.span
          className="mb-6 inline-block rounded-full border border-coral/20 bg-coral/8 px-4 py-1.5 text-[11px] font-medium tracking-[0.2em] text-coral uppercase"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
          }}
        >
          {t("hero.badge")}
        </motion.span>

        <motion.h1
          className="text-4xl font-light leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
          }}
        >
          {t("hero.title")}
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/50 sm:text-lg"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
          }}
        >
          {t("hero.description")}
        </motion.p>
      </motion.div>
    </section>
  );
}
