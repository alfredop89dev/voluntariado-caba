"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { z } from "zod";
import { useI18n } from "@/lib/i18n/translations-context";

const volunteerSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(100),
  email: z.string().email("Correo inválido"),
  phone: z.string().max(20).optional().or(z.literal("")),
  interestedEvent: z.string().max(200).optional().or(z.literal("")),
  organizer: z.string().max(100).optional().or(z.literal("")),
  instagram: z.string().max(200).optional().or(z.literal("")),
  location: z.string().max(200).optional().or(z.literal("")),
  skills: z.string().max(500).optional().or(z.literal("")),
  availability: z.string().max(500).optional().or(z.literal("")),
});

type VolunteerFormData = z.infer<typeof volunteerSchema>;

const inputClass =
  "w-full border-b border-muted/40 bg-transparent px-0 py-3 text-sm outline-none transition-all duration-200 focus:border-coral";

export function VolunteerForm() {
  const { t } = useI18n();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerSchema),
  });

  const onSubmit = async (data: VolunteerFormData) => {
    setError(null);

    try {
      const body = Object.fromEntries(
        Object.entries(data).filter(([, v]) => v !== ""),
      );

      const res = await fetch("/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error ?? t("volunteer.form.submit_error"));
        return;
      }

      setSuccess(true);
      reset();
    } catch {
      setError(t("volunteer.form.submit_error"));
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center py-12 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mb-5 flex size-14 items-center justify-center rounded-full bg-coral/10"
        >
          <CheckCircle2 size={28} className="text-coral" />
        </motion.div>
        <h3 className="mb-1.5 text-lg font-semibold">
          {t("volunteer.form.success_title")}
        </h3>
        <p className="text-sm text-taupe/70">
          {t("volunteer.form.success_message")}
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-lg border border-coral/15 bg-coral/5 px-4 py-3"
          >
            <p className="text-xs text-coral">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-0 sm:grid-cols-2">
        <div className="border-b border-muted/20 sm:border-r sm:border-b-0">
          <input
            {...register("name")}
            placeholder={t("volunteer.form.name")}
            className={inputClass}
          />
          {errors.name && <p className="px-0 pb-2 text-[11px] text-coral/80">{errors.name.message}</p>}
        </div>
        <div className="border-b border-muted/20">
          <input
            type="email"
            {...register("email")}
            placeholder={t("volunteer.form.email")}
            className={inputClass}
          />
          {errors.email && <p className="px-0 pb-2 text-[11px] text-coral/80">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid gap-0 sm:grid-cols-2">
        <div className="border-b border-muted/20 sm:border-r sm:border-b-0">
          <input
            {...register("phone")}
            placeholder={t("volunteer.form.phone")}
            className={inputClass}
          />
        </div>
        <div className="border-b border-muted/20">
          <input
            {...register("interestedEvent")}
            placeholder={t("volunteer.form.event")}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-0 sm:grid-cols-2">
        <div className="border-b border-muted/20 sm:border-r sm:border-b-0">
          <input
            {...register("organizer")}
            placeholder={t("volunteer.form.organizer")}
            className={inputClass}
          />
        </div>
        <div className="border-b border-muted/20">
          <input
            {...register("instagram")}
            placeholder={t("volunteer.form.instagram")}
            className={inputClass}
          />
        </div>
      </div>

      <div className="border-b border-muted/20">
        <input
          {...register("location")}
          placeholder={t("volunteer.form.location")}
          className={inputClass}
        />
      </div>

      <div className="grid gap-0 sm:grid-cols-2">
        <div className="border-b border-muted/20 sm:border-r sm:border-b-0">
          <input
            {...register("skills")}
            placeholder={t("volunteer.form.skills")}
            className={inputClass}
          />
        </div>
        <div className="border-b border-muted/20">
          <input
            {...register("availability")}
            placeholder={t("volunteer.form.availability")}
            className={inputClass}
          />
        </div>
      </div>

      <div className="pt-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-navy-light active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              {t("volunteer.form.submitting")}
            </>
          ) : (
            t("volunteer.form.submit")
          )}
        </button>
      </div>
    </form>
  );
}
