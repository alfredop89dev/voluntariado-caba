"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR from "swr";
import { Search } from "lucide-react";
import { z } from "zod";
import { fetchJson, formatDate } from "@/lib/api-utils";
import { useToastStore } from "@/components/ui/toast";
import { useAdminStore } from "@/stores/admin-store";
import { useI18n } from "@/lib/i18n/translations-context";

interface UserEntry {
  id: string;
  username: string;
  role: string;
  createdAt: Date;
}

const createUserSchema = z.object({
  username: z.string().min(3, "Mínimo 3 caracteres").max(50),
  password: z.string().min(6, "Mínimo 6 caracteres").max(100),
});

type CreateUserForm = z.infer<typeof createUserSchema>;

const inputClass =
  "w-full rounded-xl border border-muted/40 bg-white px-4 py-2.5 text-sm text-navy outline-none transition-all duration-200 placeholder:text-taupe/50 focus:border-coral/50 focus:ring-2 focus:ring-coral/15";

export default function AdminUsersPage() {
  const { t } = useI18n();
  const addToast = useToastStore((s) => s.addToast);
  const currentUsername = useAdminStore((s) => s.username);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: users, error: fetchError, isLoading, mutate } = useSWR<UserEntry[]>(
    "/api/admin/users",
    fetchJson,
  );

  const query = searchQuery.toLowerCase().trim();

  const filteredUsers = useMemo(
    () =>
      (users ?? []).filter(
        (u) => !query || u.username.toLowerCase().includes(query),
      ),
    [users, query],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
  });

  const onCreate = async (data: CreateUserForm) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        addToast(body.error ?? t("admin.users.error_create"), "error");
        return;
      }

      reset();
      addToast(t("admin.users.created"), "success");
      mutate();
    } catch {
      addToast(t("admin.users.error_connection"), "error");
    }
  };

  const onDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const body = await res.json();
        addToast(body.error ?? t("admin.users.error_delete"), "error");
        return;
      }

      addToast(t("admin.users.deleted"), "success");
      mutate();
    } catch {
      addToast(t("admin.users.error_connection"), "error");
    }
  };

  return (
    <div>
      <div className="mb-10">
        <p className="mb-2 text-xs font-medium text-coral uppercase tracking-[0.2em]">
          {t("admin.users.badge")}
        </p>
        <h1 className="text-3xl font-light text-navy">
          {t("admin.users.title")} <span className="font-semibold">{t("admin.users.title_accent")}</span>
        </h1>
      </div>

      <div className="mb-12 rounded-2xl border border-muted/30 bg-white p-6 shadow-xs sm:p-8">
        <h2 className="mb-6 text-lg font-semibold text-navy">{t("admin.users.create_title")}</h2>

        <form onSubmit={handleSubmit(onCreate)} className="space-y-5" noValidate>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="username" className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">
                {t("admin.users.username")}
              </label>
              <input
                id="username"
                {...register("username")}
                className={inputClass}
              />
              {errors.username && (
                <p className="mt-1.5 text-xs text-coral/90">{t("admin.users.username_min")}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-navy uppercase tracking-[0.15em]">
                {t("admin.users.password")}
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className={inputClass}
              />
              {errors.password && (
                <p className="mt-1.5 text-xs text-coral/90">{t("admin.users.password_min")}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer rounded-xl bg-coral px-6 py-2.5 text-sm font-medium text-white shadow-xs shadow-coral/20 transition-all duration-200 hover:bg-coral/90 hover:shadow-sm hover:shadow-coral/25 active:shadow-none disabled:pointer-events-none disabled:opacity-50"
          >
            {isSubmitting ? t("admin.users.creating") : t("admin.users.create_button")}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-muted/30 bg-white shadow-xs">
        <div className="border-b border-muted/20 px-6 py-4 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-navy">
              {t("admin.users.table_title")} ({filteredUsers.length})
            </h2>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("admin.users.search_placeholder")}
                className="w-48 rounded-xl border border-muted/40 bg-white py-2 pl-9 pr-4 text-xs text-navy outline-none transition-all duration-200 placeholder:text-taupe/50 focus:border-coral/50 focus:ring-2 focus:ring-coral/15 sm:w-56"
              />
            </div>
          </div>
        </div>

        {fetchError && (
          <div className="px-6 py-8 text-center text-sm text-coral">
            {t("admin.users.error_load")}
          </div>
        )}

        {isLoading && (
          <div className="px-6 py-8 text-center text-sm text-taupe">Cargando...</div>
        )}

        {!isLoading && !fetchError && filteredUsers.length === 0 && (
          <div className="px-6 py-8 text-center text-sm text-taupe">
            {searchQuery ? t("admin.users.no_results_search") : t("admin.users.no_results")}
          </div>
        )}

        {!isLoading && filteredUsers.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-muted/20 text-xs font-medium text-taupe uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium sm:px-8">{t("admin.users.table_username")}</th>
                  <th className="px-6 py-4 font-medium sm:px-8">{t("admin.users.table_role")}</th>
                  <th className="hidden px-6 py-4 font-medium sm:table-cell sm:px-8">{t("admin.users.table_created")}</th>
                  <th className="px-6 py-4 font-medium sm:px-8">{t("admin.users.table_actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-muted/10 transition-colors hover:bg-muted/10">
                    <td className="px-6 py-4 font-medium text-navy sm:px-8">{user.username}</td>
                    <td className="px-6 py-4 text-taupe sm:px-8">{user.role}</td>
                    <td className="hidden px-6 py-4 text-taupe sm:table-cell sm:px-8">{formatDate(user.createdAt)}</td>
                    <td className="px-6 py-4 sm:px-8">
                      <button
                        onClick={() => onDelete(user.id)}
                        disabled={user.username === currentUsername}
                        className="cursor-pointer rounded-xl border border-coral/30 px-3 py-1.5 text-xs font-medium text-coral transition-all duration-200 hover:bg-coral/5 hover:shadow-xs disabled:cursor-not-allowed disabled:opacity-30"
                        title={user.username === currentUsername ? t("admin.users.cannot_delete_self") : undefined}
                      >
                        {user.username === currentUsername ? t("admin.users.you") : t("admin.users.delete")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
