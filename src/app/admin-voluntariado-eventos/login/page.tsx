"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { z } from "zod";
import { useAdminStore } from "@/stores/admin-store";
import { ADMIN } from "@/lib/config";
import { useI18n } from "@/lib/i18n/translations-context";

const loginSchema = z.object({
  username: z.string().min(1, "El usuario es obligatorio"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        setError(body.error ?? t("admin.login.error_invalid"));
        return;
      }

      const body = await res.json();
      useAdminStore.getState().setAuth(body.username);
      setSuccess(true);

      setTimeout(() => {
        router.replace(ADMIN.DASHBOARD_PATH);
      }, 800);
    } catch {
      setError(t("admin.login.error_connection"));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-light text-white tracking-wide">
            {t("admin.title")}
          </h1>
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-green-500/20 bg-green-500/10 p-8 text-center backdrop-blur-sm"
            >
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-green-500/20">
                <svg className="size-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-medium text-green-300">
                ¡Bienvenido!
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
            >
              <h2 className="mb-6 text-lg font-semibold text-white">
                {t("admin.login.title")}
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden rounded-xl bg-coral/15 px-4 py-3"
                    >
                      <p className="text-xs font-medium text-coral">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-white/70 uppercase tracking-[0.15em]">
                    {t("admin.login.username")}
                  </label>
                  <input
                    {...register("username")}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-all duration-200 placeholder:text-white/30 focus:border-coral/50 focus:ring-2 focus:ring-coral/15"
                    placeholder={t("admin.login.username")}
                  />
                  {errors.username && (
                    <p className="mt-1.5 text-xs text-coral/90">{errors.username.message}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-white/70 uppercase tracking-[0.15em]">
                    {t("admin.login.password")}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 pr-10 text-sm text-white outline-none transition-all duration-200 placeholder:text-white/30 focus:border-coral/50 focus:ring-2 focus:ring-coral/15"
                      placeholder={t("admin.login.password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white/40 transition-colors hover:text-white/70"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-xs text-coral/90">{errors.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full cursor-pointer rounded-xl bg-coral px-6 py-2.5 text-sm font-medium text-white shadow-xs shadow-coral/20 transition-all duration-200 hover:bg-coral/90 hover:shadow-sm hover:shadow-coral/25 active:shadow-none disabled:pointer-events-none disabled:opacity-50"
                >
                  {isSubmitting ? t("admin.login.logging_in") : t("admin.login.login_button")}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
