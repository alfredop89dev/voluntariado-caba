"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useVolunteerSubmit } from "@/hooks/use-volunteer";
import { volunteerSchema } from "@/lib/schemas";
import type { z } from "zod";

type VolunteerFormData = z.infer<typeof volunteerSchema>;

const inputClass =
  "w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none transition-all duration-200 placeholder:text-white/30 focus:border-coral/60 focus:bg-white/15 focus:ring-2 focus:ring-coral/20";

const labelClass =
  "mb-1.5 block text-[11px] font-semibold text-white/80 uppercase tracking-[0.15em]";

export function VolunteerForm() {
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
        <p className="mb-2 text-lg font-semibold text-white">¡Gracias por registrarte!</p>
        <p className="text-sm text-white/60">Te contactaremos pronto con más información.</p>
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
          Ocurrió un error al registrarte. Intenta de nuevo.
        </motion.div>
      )}

      <div>
        <label htmlFor="name" className={labelClass}>
          Nombre completo
        </label>
        <input
          id="name"
          {...register("name")}
          className={inputClass}
        />
        {errors.name && (
          <p className="mt-1.5 text-xs text-coral/90">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className={inputClass}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-coral/90">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="interestedEvent" className={labelClass}>
          ¿A qué evento querés sumarte? (opcional)
        </label>
        <input
          id="interestedEvent"
          {...register("interestedEvent")}
          placeholder="Ej: Jornada de Acopio, Taller de salud..."
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="organizer" className={labelClass}>
          Organización / grupo (opcional)
        </label>
        <input
          id="organizer"
          {...register("organizer")}
          placeholder="Ej: Red de Voluntarios, Brigada Juvenil..."
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="instagram" className={labelClass}>
          Instagram (opcional)
        </label>
        <input
          id="instagram"
          {...register("instagram")}
          placeholder="@tuusuario"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>
          Teléfono (opcional)
        </label>
        <input
          id="phone"
          {...register("phone")}
          placeholder="Ej: 11-1234-5678"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="location" className={labelClass}>
          Ubicación / barrio (opcional)
        </label>
        <input
          id="location"
          {...register("location")}
          placeholder="Ej: Palermo, CABA"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="skills" className={labelClass}>
          Habilidades / área de ayuda (opcional)
        </label>
        <input
          id="skills"
          {...register("skills")}
          placeholder="Ej: salud, logística, construcción, traducción..."
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="availability" className={labelClass}>
          Disponibilidad (opcional)
        </label>
        <input
          id="availability"
          {...register("availability")}
          placeholder="Ej: fines de semana, tiempo completo..."
          className={inputClass}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
        {isSubmitting ? "Enviando..." : "Enviar inscripción"}
      </Button>
    </form>
  );
}
