"use client";

import useSWRMutation from "swr/mutation";

interface VolunteerInput {
  name: string;
  email: string;
  phone?: string;
  skills?: string;
  availability?: string;
}

async function submitVolunteer(url: string, { arg }: { arg: VolunteerInput }) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  });

  if (!res.ok) throw new Error("Error al registrar voluntario");
  return res.json();
}

export function useVolunteerSubmit() {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/volunteers",
    submitVolunteer,
  );

  return {
    submit: trigger,
    isSubmitting: isMutating,
    error,
  };
}
