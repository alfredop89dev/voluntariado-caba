"use client";

import useSWR from "swr";
import { Calendar, Users, Shield, Clock, CheckCircle, XCircle, UserPlus } from "lucide-react";
import { fetchJson, formatDate } from "@/lib/api-utils";
import { useI18n } from "@/lib/i18n/translations-context";
import type { IEventData } from "@/lib/models/event";

interface VolunteerEntry {
  id: string;
  status: string;
}

interface UserEntry {
  id: string;
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-muted/30 bg-white p-6 shadow-xs sm:p-8">
      <div className="mb-3 size-10 rounded-xl bg-muted/30 animate-pulse" />
      <div className="mb-2 h-3 w-20 rounded bg-muted/30 animate-pulse" />
      <div className="h-8 w-16 rounded bg-muted/30 animate-pulse" />
      <div className="mt-2 h-3 w-24 rounded bg-muted/30 animate-pulse" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 border-b border-muted/10 px-6 py-3 sm:px-8">
      <div className="size-2 shrink-0 rounded-full bg-muted/30 animate-pulse" />
      <div className="flex-1 space-y-1.5">
        <div className="h-4 w-3/5 rounded bg-muted/30 animate-pulse" />
        <div className="h-3 w-2/5 rounded bg-muted/30 animate-pulse" />
      </div>
      <div className="h-3 w-20 rounded bg-muted/30 animate-pulse" />
    </div>
  );
}

export default function AdminDashboardPage() {
  const { t } = useI18n();
  const { data: events, isLoading: eventsLoading, error: eventsError, mutate: retryEvents } = useSWR<IEventData[]>("/api/admin/events", fetchJson);
  const { data: volunteers, isLoading: volsLoading, error: volsError, mutate: retryVols } = useSWR<VolunteerEntry[]>("/api/admin/volunteers", fetchJson);
  const { data: users, isLoading: usersLoading, error: usersError, mutate: retryUsers } = useSWR<UserEntry[]>("/api/admin/users", fetchJson);

  const isLoading = eventsLoading || volsLoading || usersLoading;
  const hasError = eventsError || volsError || usersError;

  const pendingVolunteers = volunteers?.filter((v) => v.status === "pending").length ?? 0;
  const contactedVolunteers = volunteers?.filter((v) => v.status === "contacted").length ?? 0;
  const approvedVolunteers = volunteers?.filter((v) => v.status === "approved").length ?? 0;
  const rejectedVolunteers = volunteers?.filter((v) => v.status === "rejected").length ?? 0;

  const now = new Date();
  const upcomingEvents = events
    ?.filter((e) => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5) ?? [];

  const volunteerStatusCards = [
    { label: t("admin.dashboard.status_pending"), value: pendingVolunteers, color: "bg-amber-100 text-amber-700", icon: Clock },
    { label: t("admin.dashboard.status_contacted"), value: contactedVolunteers, color: "bg-blue-100 text-blue-700", icon: UserPlus },
    { label: t("admin.dashboard.status_approved"), value: approvedVolunteers, color: "bg-green-100 text-green-700", icon: CheckCircle },
    { label: t("admin.dashboard.status_rejected"), value: rejectedVolunteers, color: "bg-red-100 text-red-700", icon: XCircle },
  ];

  return (
    <div>
      <div className="mb-10">
        <p className="mb-2 text-xs font-medium text-coral uppercase tracking-[0.2em]">
          {t("admin.dashboard.badge")}
        </p>
        <h1 className="text-3xl font-light text-navy">
          {t("admin.dashboard.title")} <span className="font-semibold">{t("admin.dashboard.title_accent")}</span>
        </h1>
      </div>

      {hasError && (
        <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="mb-3 text-sm text-red-700">{t("admin.dashboard.error_loading")}</p>
          <button
            onClick={() => { retryEvents(); retryVols(); retryUsers(); }}
            className="cursor-pointer rounded-xl bg-red-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-red-700"
          >
            {t("admin.dashboard.retry")}
          </button>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-3">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <div className="rounded-2xl border border-muted/30 bg-white p-6 shadow-xs sm:p-8">
              <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-coral/10 text-coral">
                <Calendar size={20} />
              </div>
              <p className="text-xs font-semibold text-taupe uppercase tracking-[0.15em]">{t("admin.dashboard.events_card")}</p>
              <p className="mt-1 text-3xl font-light text-navy">{events?.length ?? 0}</p>
              <p className="mt-1 text-xs text-taupe">{upcomingEvents.length} {t("admin.dashboard.upcoming")}</p>
            </div>

            <div className="rounded-2xl border border-muted/30 bg-white p-6 shadow-xs sm:p-8">
              <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-coral/10 text-coral">
                <Users size={20} />
              </div>
              <p className="text-xs font-semibold text-taupe uppercase tracking-[0.15em]">{t("admin.dashboard.volunteers_card")}</p>
              <p className="mt-1 text-3xl font-light text-navy">{volunteers?.length ?? 0}</p>
              <p className="mt-1 text-xs text-taupe">{pendingVolunteers} {t("admin.dashboard.pending")}</p>
            </div>

            <div className="rounded-2xl border border-muted/30 bg-white p-6 shadow-xs sm:p-8">
              <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-coral/10 text-coral">
                <Shield size={20} />
              </div>
              <p className="text-xs font-semibold text-taupe uppercase tracking-[0.15em]">{t("admin.dashboard.users_card")}</p>
              <p className="mt-1 text-3xl font-light text-navy">{users?.length ?? 0}</p>
              <p className="mt-1 text-xs text-taupe">{t("admin.dashboard.admins")}</p>
            </div>
          </>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-muted/30 bg-white shadow-xs">
          <div className="border-b border-muted/20 px-6 py-4 sm:px-8">
            <h2 className="text-sm font-semibold text-navy">{t("admin.dashboard.volunteer_status_title")}</h2>
          </div>
          {isLoading ? (
            <div className="space-y-0">
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </div>
          ) : (
            <div className="divide-y divide-muted/10 px-6 py-4 sm:px-8">
              {volunteerStatusCards.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex size-8 items-center justify-center rounded-lg ${s.color}`}>
                        <Icon size={14} />
                      </div>
                      <span className="text-sm text-navy">{s.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-navy">{s.value}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-muted/30 bg-white shadow-xs">
          <div className="border-b border-muted/20 px-6 py-4 sm:px-8">
            <h2 className="text-sm font-semibold text-navy">{t("admin.dashboard.upcoming_events_title")}</h2>
          </div>
          {isLoading ? (
            <div className="space-y-0">
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-taupe sm:px-8">
              {t("admin.dashboard.no_upcoming")}
            </div>
          ) : (
            <div className="divide-y divide-muted/10">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between px-6 py-3 sm:px-8">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-navy">{event.title}</p>
                    <p className="text-xs text-taupe">{formatDate(event.date)}</p>
                  </div>
                  {event.status && event.status !== "activo" && (
                    <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-medium text-amber-700 capitalize">
                      {event.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
