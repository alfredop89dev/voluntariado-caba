"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToastStore } from "@/components/ui/toast";

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

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al cargar datos");
  return res.json();
};

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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
  const addToast = useToastStore((s) => s.addToast);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { data: volunteers, error, isLoading, mutate } = useSWR<VolunteerEntry[]>(
    "/api/admin/volunteers",
    fetcher,
  );

  const filteredVolunteers = useMemo(
    () =>
      (volunteers ?? []).filter(
        (v) => filterStatus === "all" || v.status === filterStatus,
      ),
    [volunteers, filterStatus],
  );

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/volunteers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      addToast(`Estado actualizado a "${STATUS_LABELS[status]}"`, "success");
    } else {
      addToast("Error al actualizar estado", "error");
    }
    mutate();
  };

  const onDelete = async () => {
    if (!deleteTarget) return;
    const res = await fetch(`/api/admin/volunteers/${deleteTarget}`, { method: "DELETE" });
    setDeleteTarget(null);
    if (res.ok) {
      addToast("Solicitud eliminada correctamente", "success");
    } else {
      addToast("Error al eliminar solicitud", "error");
    }
    await mutate();
  };

  const exportCSV = () => {
    if (!volunteers || volunteers.length === 0) return;
    const headers = ["Nombre", "Email", "Teléfono", "Evento", "Organización", "Instagram", "Ubicación", "Habilidades", "Disponibilidad", "Estado", "Fecha"];
    const rows = filteredVolunteers.map((v) => [
      v.name, v.email, v.phone ?? "", v.interestedEvent ?? "", v.organizer ?? "",
      v.instagram ?? "", v.location ?? "", v.skills ?? "", v.availability ?? "",
      STATUS_LABELS[v.status] ?? v.status, formatDate(v.createdAt),
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
          Admin
        </p>
        <h1 className="text-3xl font-light text-navy">
          Solicitudes de <span className="font-semibold">voluntarios</span>
        </h1>
        <p className="mt-2 text-sm text-taupe">
          {volunteers?.length ? `Total: ${volunteers.length} solicitudes` : ""}
        </p>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Eliminar solicitud"
        message="¿Estás seguro? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={onDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {error && (
        <div className="mb-6 rounded-xl border border-coral/20 bg-coral/5 px-4 py-3 text-xs text-coral">
          Error al cargar las solicitudes
        </div>
      )}

      {!error && volunteers && volunteers.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-3">
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
                {s === "all" ? "Todos" : STATUS_LABELS[s]}
              </button>
            ))}
          </div>
          <button
            onClick={exportCSV}
            className="ml-auto cursor-pointer rounded-xl border border-muted/40 px-3 py-1.5 text-xs font-medium text-taupe transition-all duration-200 hover:border-muted/70 hover:text-navy hover:shadow-xs"
          >
            Exportar CSV
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
            ? "No hay solicitudes con ese filtro."
            : "No hay solicitudes de voluntarios todavía."}
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
                  {formatDate(v.createdAt)}
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
                    <p className="mb-0.5 text-xs font-semibold text-navy uppercase tracking-[0.15em]">Evento de interés</p>
                    <p className="text-xs text-taupe">{v.interestedEvent}</p>
                  </div>
                )}
                {v.phone && (
                  <div>
                    <p className="mb-0.5 text-xs font-semibold text-navy uppercase tracking-[0.15em]">Teléfono</p>
                    <p className="text-xs text-taupe">{v.phone}</p>
                  </div>
                )}
                {v.organizer && (
                  <div>
                    <p className="mb-0.5 text-xs font-semibold text-navy uppercase tracking-[0.15em]">Organización</p>
                    <p className="text-xs text-taupe">{v.organizer}</p>
                  </div>
                )}
                {v.instagram && (
                  <div>
                    <p className="mb-0.5 text-xs font-semibold text-navy uppercase tracking-[0.15em]">Instagram</p>
                    <p className="text-xs text-taupe">{v.instagram}</p>
                  </div>
                )}
                {v.location && (
                  <div>
                    <p className="mb-0.5 text-xs font-semibold text-navy uppercase tracking-[0.15em]">Ubicación</p>
                    <p className="text-xs text-taupe">{v.location}</p>
                  </div>
                )}
                {v.skills && (
                  <div>
                    <p className="mb-0.5 text-xs font-semibold text-navy uppercase tracking-[0.15em]">Habilidades</p>
                    <p className="text-xs text-taupe">{v.skills}</p>
                  </div>
                )}
                {v.availability && (
                  <div>
                    <p className="mb-0.5 text-xs font-semibold text-navy uppercase tracking-[0.15em]">Disponibilidad</p>
                    <p className="text-xs text-taupe">{v.availability}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setDeleteTarget(v.id)}
                  className="cursor-pointer rounded-xl border border-coral/30 px-3 py-1.5 text-xs font-medium text-coral transition-all duration-200 hover:bg-coral/5 hover:shadow-xs"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
