"use client";

import { Heart, ClipboardList, Users } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { useI18n } from "@/lib/i18n/translations-context";

const cards = [
  {
    key: "card_1",
    icon: Heart,
    color: "text-coral bg-coral/10",
  },
  {
    key: "card_2",
    icon: ClipboardList,
    color: "text-navy bg-navy/10",
  },
  {
    key: "card_3",
    icon: Users,
    color: "text-coral bg-coral/10",
  },
] as const;

export function AboutSection() {
  const { t } = useI18n();

  return (
    <section className="bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="mb-4 inline-block text-[11px] font-semibold tracking-[0.2em] text-coral uppercase">
              {t("about.badge")}
            </span>
            <h2 className="text-3xl font-light leading-tight text-navy sm:text-4xl">
              {t("about.title")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-taupe/80">
              {t("about.description")}
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-3">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <FadeIn key={card.key} delay={i * 0.1}>
                <div className="group rounded-2xl border border-muted/20 bg-white p-8 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-navy/5">
                  <div
                    className={`mb-5 flex size-12 items-center justify-center rounded-xl ${card.color} transition-all duration-300 group-hover:scale-110`}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-navy">
                    {t(`about.${card.key}_title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-taupe/80">
                    {t(`about.${card.key}_description`)}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
