import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(1, "El título es obligatorio").max(200),
  organizer: z.string().max(100).optional().or(z.literal("")),
  image: z.string().url("URL inválida").optional().or(z.literal("")),
  date: z.string().datetime("Fecha inválida").or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
  time: z.string().max(10).optional().or(z.literal("")),
  description: z.string().max(2000).optional().or(z.literal("")),
  location: z.string().max(200).optional().or(z.literal("")),
  flyer: z.string().url("URL inválida").optional().or(z.literal("")),
  logo: z.string().url("URL inválida").optional().or(z.literal("")),
  instagram: z.string().max(200).optional().or(z.literal("")),
  googleMaps: z.string().url("URL inválida").optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
});

export const volunteerSchema = z.object({
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
