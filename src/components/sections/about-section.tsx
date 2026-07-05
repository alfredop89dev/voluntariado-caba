"use client";

import { FadeIn } from "@/components/ui/fade-in";
import { useI18n } from "@/lib/i18n/translations-context";

const cardKeys = [
  { title: "about.card_1_title", desc: "about.card_1_description" },
  { title: "about.card_2_title", desc: "about.card_2_description" },
  { title: "about.card_3_title", desc: "about.card_3_description" },
] as const;

export function AboutSection() {
  const { t } = useI18n();

  return (
    <section className="bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <FadeIn>
            <p className="mb-3 text-xs font-medium text-coral uppercase tracking-[0.2em]">
              {t("about.badge")}
            </p>
            <h2 className="mb-4 text-3xl font-light text-navy sm:text-4xl">
              {t("about.title")}
            </h2>
            <p className="text-sm font-light leading-relaxed text-taupe">
              {t("about.description")}
            </p>
          </FadeIn>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {cardKeys.map((keys, i) => (
            <FadeIn key={keys.title} delay={i * 0.1}>
              <div className="group rounded-2xl border border-muted/30 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-8">
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-coral/10 text-coral transition-colors duration-300 group-hover:bg-coral group-hover:text-white">
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    {i === 0 && (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    )}
                    {i === 1 && (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    )}
                    {i === 2 && (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    )}
                  </svg>
                </div>
                <h3 className="mb-2 text-base font-semibold text-navy">{t(keys.title)}</h3>
                <p className="text-xs leading-relaxed text-taupe">{t(keys.desc)}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
