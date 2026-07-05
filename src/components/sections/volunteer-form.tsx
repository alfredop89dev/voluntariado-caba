"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useVolunteerSubmit } from "@/hooks/use-volunteer";
import { volunteerSchema } from "@/lib/schemas";
import { useI18n } from "@/lib/i18n/translations-context";
import type { z } from "zod";

type VolunteerFormData = z.infer<typeof volunteerSchema>;

const inputClass =
  "w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none transition-all duration-200 placeholder:text-white/30 focus:border-coral/60 focus:bg-white/15 focus:ring-2 focus:ring-coral/20";

const labelClass =
  "mb-1.5 block text-[11px] font-semibold text-white/80 uppercase tracking-[0.15em]";

export function VolunteerForm() {
  const { t } = useI18n();
  const [submitted, setSubmitted] = useState(false);
  const { submit, isSubmitting, error: submitError } = useVolunteerSubmit();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerSchema),
  });

  const onSubmit = async (data: VolunteerFormData) => {
    try {
      await submit(data);
      setSubmitted(true);
    } catch {
      /* error handled via submitError from SWR */
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="rounded-2xl border border-white/15 bg-white/10 p-8 text-center backdrop-blur-sm"
      >
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-coral/20">
          <svg className="size-6 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="mb-2 text-lg font-semibold text-white">{t("volunteer.form.success_title")}</p>
        <p className="text-sm text-white/60">{t("volunteer.form.success_message")}</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {submitError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-coral/30 bg-coral/10 px-4 py-3 text-xs text-coral"
        >
          {t("volunteer.form.submit_error")}
        </motion.div>
      )}

      <div>
        <label htmlFor="name" className={labelClass}>
          {t("volunteer.form.name")}
        </label>
        <input id="name" {...register("name")} className={inputClass} />
        {errors.name && (
          <p className="mt-1.5 text-xs text-coral/90">{t("volunteer.form.errors.name_required")}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          {t("volunteer.form.email")}
        </label>
        <input id="email" type="email" {...register("email")} className={inputClass} />
        {errors.email && (
          <p className="mt-1.5 text-xs text-coral/90">{t("volunteer.form.errors.email_required")}</p>
        )}
      </div>

      <div>
        <label htmlFor="interestedEvent" className={labelClass}>
          {t("volunteer.form.event")}
        </label>
        <input id="interestedEvent" {...register("interestedEvent")} className={inputClass} />
      </div>

      <div>
        <label htmlFor="organizer" className={labelClass}>
          {t("volunteer.form.organizer")}
        </label>
        <input id="organizer" {...register("organizer")} className={inputClass} />
      </div>

      <div>
        <label htmlFor="instagram" className={labelClass}>
          {t("volunteer.form.instagram")}
        </label>
        <input id="instagram" {...register("instagram")} className={inputClass} />
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>
          {t("volunteer.form.phone")}
        </label>
        <input id="phone" {...register("phone")} className={inputClass} />
      </div>

      <div>
        <label htmlFor="location" className={labelClass}>
          {t("volunteer.form.location")}
        </label>
        <input id="location" {...register("location")} className={inputClass} />
      </div>

      <div>
        <label htmlFor="skills" className={labelClass}>
          {t("volunteer.form.skills")}
        </label>
        <input id="skills" {...register("skills")} className={inputClass} />
      </div>

      <div>
        <label htmlFor="availability" className={labelClass}>
          {t("volunteer.form.availability")}
        </label>
        <input id="availability" {...register("availability")} className={inputClass} />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
        {isSubmitting ? t("volunteer.form.submitting") : t("volunteer.form.submit")}
      </Button>
    </form>
  );
}
