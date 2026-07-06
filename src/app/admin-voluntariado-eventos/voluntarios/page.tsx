"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { Search } from "lucide-react";
import { fetchJson, formatDateTime } from "@/lib/api-utils";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToastStore } from "@/components/ui/toast";
import { useI18n } from "@/lib/i18n/translations-context";

interface VolunteerEntry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  interestedEvent: string | null;
  organizer: string | null;
  instagram: string | null;
  location: string | null;
  skills: string | null;
  availability: string | null;
  status: string;
  createdAt: Date;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  contacted: "Contactado",
  approved: "Aprobado",
  rejected: "Rechazado",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  contacted: "bg-blue-50 text-blue-700 border-blue-200",
  approved: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

export default function AdminVolunteersPage() {
  const { t } = useI18n();
  const addToast = useToastStore((s) => s.addToast);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: volunteers, error, isLoading, mutate } = useSWR<VolunteerEntry[]>(
    "/api/admin/volunteers",
    fetchJson,
  );

  const query = searchQuery.toLowerCase().trim();

  const filteredVolunteers = useMemo(
    () =>
      (volunteers ?? []).filter(
        (v) =>
          (filterStatus === "all" || v.status === filterStatus) &&
          (!query ||
            v.name.toLowerCase().includes(query) ||
            v.email.toLowerCase().includes(query) ||
            (v.location ?? "").toLowerCase().includes(query)),
      ),
    [volunteers, filterStatus, query],
  );

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/volunteers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      addToast(`${t("admin.volunteers.status_updated")} "${STATUS_LABELS[status]}"`, "success");
    } else {
      addToast(t("admin.volunteers.error_update"), "error");
    }
    mutate();
  };

  const onDelete = async () => {
    if (!deleteTarget) return;
    const res = await fetch(`/api/admin/volunteers/${deleteTarget}`, { method: "DELETE" });
    setDeleteTarget(null);
    if (res.ok) {
      addToast(t("admin.volunteers.deleted"), "success");
    } else {
      addToast(t("admin.volunteers.error_delete"), "error");
    }
    await mutate();
  };

  const exportCSV = () => {
    if (!volunteers || volunteers.length === 0) return;
    const headers = ["Nombre", "Email", "Teléfono", "Evento", "Organización", "Instagram", "Ubicación", "Habilidades", "Disponibilidad", "Estado", "Fecha"];
    const rows = filteredVolunteers.map((v) => [
      v.name, v.email, v.phone ?? "", v.interestedEvent ?? "", v.organizer ?? "",
      v.instagram ?? "", v.location ?? "", v.skills ?? "", v.availability ?? "",
      STATUS_LABELS[v.status] ?? v.status, formatDateTime(v.createdAt),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "voluntarios.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-10">
        <p className="mb-2 text-xs font-medium text-coral uppercase tracking-[0.2em]">
          {t("admin.volunteers.badge")}
        </p>
        <h1 className="text-3xl font-light text-navy">
          {t("admin.volunteers.title")} <span className="font-semibold">{t("admin.volunteers.title_accent")}</span>
        </h1>
        <p className="mt-2 text-sm text-taupe">
          {volunteers?.length ? `${t("admin.volunteers.total")}: ${volunteers.length}` : ""}
        </p>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title={t("admin.volunteers.delete_confirm_title")}
        message={t("admin.volunteers.delete_confirm_message")}
        confirmLabel={t("admin.volunteers.delete_confirm_label")}
        cancelLabel={t("admin.volunteers.cancel_label")}
        variant="danger"
        onConfirm={onDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {error && (
        <div className="mb-6 rounded-xl border border-coral/20 bg-coral/5 px-4 py-3 text-xs text-coral">
          {t("admin.volunteers.error")}
        </div>
      )}

      {!error && volunteers && volunteers.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative grow sm:grow-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("admin.volunteers.search_placeholder")}
              className="w-full rounded-xl border border-muted/40 bg-white py-2 pl-9 pr-4 text-xs text-navy outline-none transition-all duration-200 placeholder:text-taupe/50 focus:border-coral/50 focus:ring-2 focus:ring-coral/15 sm:w-64"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["all", "pending", "contacted", "approved", "rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`cursor-pointer rounded-xl border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                  filterStatus === s
                    ? "border-navy bg-navy text-white shadow-xs"
                    : "border-muted/40 text-taupe hover:border-muted/70 hover:text-navy"
                }`}
              >
                {s === "all" ? t("admin.volunteers.filter_all") : STATUS_LABELS[s]}
              </button>
            ))}
          </div>
          <button
            onClick={exportCSV}
            className="ml-auto cursor-pointer rounded-xl border border-muted/40 px-3 py-1.5 text-xs font-medium text-taupe transition-all duration-200 hover:border-muted/70 hover:text-navy hover:shadow-xs"
          >
            {t("admin.volunteers.export_csv")}
          </button>
        </div>
      )}

      {isLoading && (
        <div className="rounded-2xl border border-muted/30 bg-white px-6 py-12 text-center text-sm text-taupe shadow-xs">
          Cargando...
        </div>
      )}

      {!isLoading && !error && filteredVolunteers.length === 0 && (
        <div className="rounded-2xl border border-muted/30 bg-white px-6 py-12 text-center text-sm text-taupe shadow-xs">
          {volunteers?.length
            ? t("admin.volunteers.no_results_filter")
            : t("admin.volunteers.no_results")}
        </div>
      )}

      {!isLoading && filteredVolunteers.length > 0 && (
        <div className="space-y-4">
          {filteredVolunteers.map((v) => (
            <div
              key={v.id}
              className="rounded-2xl border border-muted/30 bg-white p-6 shadow-xs transition-all duration-200 hover:shadow-sm sm:p-8"
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-navy">{v.name}</h3>
                    <p className="text-xs text-taupe">{v.email}</p>
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${STATUS_COLORS[v.status] ?? "bg-muted/20 text-taupe"}`}>
                    {STATUS_LABELS[v.status] ?? v.status}
                  </span>
                </div>
                <span className="shrink-0 text-xs text-taupe/70">
                  {formatDateTime(v.createdAt)}
                </span>
              </div>

              <div className="mb-4 flex flex-wrap gap-1.5">
                {["pending", "contacted", "approved", "rejected"].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(v.id, s)}
                    className={`cursor-pointer rounded-xl border px-2.5 py-1 text-[11px] font-medium transition-all duration-200 ${
                      v.status === s
                        ? "border-navy bg-navy text-white"
                        : "border-muted/40 text-taupe hover:border-muted/70 hover:text-navy"
                    }`}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {v.interestedEvent && (
                  <div>
                    <p className="mb-0.5 text-xs font-semibold text-navy uppercase tracking-[0.15em]">{t("admin.volunteers.event_field")}</p>
                    <p className="text-xs text-taupe">{v.interestedEvent}</p>
                  </div>
                )}
                {v.phone && (
                  <div>
                    <p className="mb-0.5 text-xs font-semibold text-navy uppercase tracking-[0.15em]">{t("admin.volunteers.phone_field")}</p>
                    <p className="text-xs text-taupe">{v.phone}</p>
                  </div>
                )}
                {v.organizer && (
                  <div>
                    <p className="mb-0.5 text-xs font-semibold text-navy uppercase tracking-[0.15em]">{t("admin.volunteers.organizer_field")}</p>
                    <p className="text-xs text-taupe">{v.organizer}</p>
                  </div>
                )}
                {v.instagram && (
                  <div>
                    <p className="mb-0.5 text-xs font-semibold text-navy uppercase tracking-[0.15em]">{t("admin.volunteers.instagram_field")}</p>
                    <p className="text-xs text-taupe">{v.instagram}</p>
                  </div>
                )}
                {v.location && (
                  <div>
                    <p className="mb-0.5 text-xs font-semibold text-navy uppercase tracking-[0.15em]">{t("admin.volunteers.location_field")}</p>
                    <p className="text-xs text-taupe">{v.location}</p>
                  </div>
                )}
                {v.skills && (
                  <div>
                    <p className="mb-0.5 text-xs font-semibold text-navy uppercase tracking-[0.15em]">{t("admin.volunteers.skills_field")}</p>
                    <p className="text-xs text-taupe">{v.skills}</p>
                  </div>
                )}
                {v.availability && (
                  <div>
                    <p className="mb-0.5 text-xs font-semibold text-navy uppercase tracking-[0.15em]">{t("admin.volunteers.availability_field")}</p>
                    <p className="text-xs text-taupe">{v.availability}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setDeleteTarget(v.id)}
                  className="cursor-pointer rounded-xl border border-coral/30 px-3 py-1.5 text-xs font-medium text-coral transition-all duration-200 hover:bg-coral/5 hover:shadow-xs"
                >
                  {t("admin.volunteers.delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
