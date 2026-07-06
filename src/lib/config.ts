export const SECTION_IDS = {
  calendario: "calendario",
  voluntariado: "voluntariado",
  donaciones: "donaciones",
} as const;

export const NAV_LINKS = [
  { href: `#${SECTION_IDS.calendario}`, label: "Calendario" },
  { href: `#${SECTION_IDS.voluntariado}`, label: "Voluntariado" },
  { href: `#${SECTION_IDS.donaciones}`, label: "Donaciones" },
] as const;

export const ADMIN = {
  BASE_PATH: "/admin-voluntariado-eventos",
  LOGIN_PATH: "/admin-voluntariado-eventos/login",
  DASHBOARD_PATH: "/admin-voluntariado-eventos/dashboard",
  NAV_ITEMS: [
    { href: "/admin-voluntariado-eventos/dashboard", label: "Dashboard" },
    { href: "/admin-voluntariado-eventos", label: "Eventos" },
    { href: "/admin-voluntariado-eventos/voluntarios", label: "Voluntarios" },
    { href: "/admin-voluntariado-eventos/usuarios", label: "Usuarios" },
    { href: "/", label: "Ver landing", external: true },
  ] as const,
  SESSION_MAX_AGE: Number(process.env.ADMIN_SESSION_MAX_AGE) || 86400,
} as const;

export const RATE_LIMIT = {
  WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,
  MAX_REQUESTS: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 10,
} as const;

export const ADMIN_RATE_LIMIT = {
  WINDOW_MS: 60_000,
  MAX_REQUESTS: 30,
} as const;

export const CALENDAR = {
  GROUPS_PER_PAGE: 2,
} as const;

export const INSTAGRAM_BASE_URL = "https://instagram.com/";
