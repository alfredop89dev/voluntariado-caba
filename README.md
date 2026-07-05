# Red de Voluntarios — Landing Page

Sitio web para la **Red de Voluntarios en CABA por Venezuela**, desarrollado como apoyo a las víctimas del terremoto en Venezuela. Plataforma de gestión de voluntarios, eventos y donaciones.

## Stack

| Tecnología | Versión | Uso |
|---|---|---|
| Next.js | 16.2.10 | Framework (App Router) |
| React | 19.2.4 | UI |
| TypeScript | 5.x | Tipado |
| Tailwind CSS | 4.x | Estilos |
| MongoDB + Mongoose | 9.x | Base de datos |
| Motion | 12.x | Animaciones |
| SWR | 2.x | Data fetching |
| Zustand | 5.x | Estado global |
| react-hook-form | 7.x | Formularios |
| Zod | 4.x | Validación |

## Estructura del proyecto

```
src/
├── app/
│   ├── api/
│   │   ├── events/              # CRUD eventos (GET, POST)
│   │   │   ├── [id]/route.ts    # GET, PUT, DELETE evento individual
│   │   │   └── route.ts
│   │   └── volunteers/          # CRUD voluntarios (GET, POST)
│   │       └── route.ts
│   ├── events/[id]/
│   │   ├── loading.tsx          # Skeleton loading
│   │   └── page.tsx             # Detalle de evento con hero
│   ├── error.tsx                # Error boundary global
│   ├── globals.css              # Tailwind v4 + temas
│   ├── layout.tsx               # Root layout (Inter font, metadata)
│   ├── not-found.tsx            # Página 404 personalizada
│   └── page.tsx                 # Landing page
├── components/
│   ├── layout/
│   │   ├── footer.tsx
│   │   └── header.tsx           # Nav + menú mobile (Zustand)
│   ├── sections/
│   │   ├── about-section.tsx    # Quiénes somos
│   │   ├── calendar-section.tsx # Calendario agrupado por fecha + paginación
│   │   ├── donations-section.tsx
│   │   ├── hero.tsx             # Hero con gradiente + 8 estrellas SVG
│   │   ├── volunteer-form.tsx   # Formulario react-hook-form
│   │   └── volunteer-section.tsx
│   └── ui/
│       ├── button.tsx           # Motion-animated (3 variants)
│       ├── fade-in.tsx          # Scroll reveal wrapper
│       ├── pagination.tsx       # Paginación reutilizable
│       └── skeleton.tsx         # Skeleton shimmer
├── hooks/
│   ├── use-events.ts            # SWR fetch eventos
│   └── use-volunteer.ts         # SWR mutation voluntarios
├── lib/
│   ├── models/
│   │   ├── event.ts             # Schema: title, date, time, location, flyer, etc.
│   │   ├── user.ts              # Schema: username, password (scrypt), role
│   │   └── volunteer.ts         # Schema: name, email, phone, skills, status
│   ├── demo-events.ts           # 4 eventos demo offline
│   ├── auth.ts                   # HMAC-SHA256 tokens
│   ├── config.ts                 # Constantes compartidas
│   ├── get-event.ts              # Server: get event by ID (DB)
│   ├── mongodb.ts               # Conexión singleton
│   ├── rate-limiter.ts          # In-memory rate limit (10 req/min)
│   ├── schemas.ts               # Validación Zod
│   └── utils.ts                 # cn() utility
└── stores/
    └── ui-store.ts              # Zustand: menú mobile
```

## Funcionalidades

| Funcionalidad | Estado |
|---|---|
| Landing page con Hero animado | ✅ |
| Gradiente navy con 8 estrellas SVG (bandera Venezuela) | ✅ |
| Calendario de eventos agrupados por fecha | ✅ |
| Paginación por grupos de fecha | ✅ |
| Placeholder SVG cuando no hay imagen | ✅ |
| Página de detalle `/events/[id]` con hero | ✅ |
| Skeleton loading en detalle de evento | ✅ |
| Formulario de voluntariado (react-hook-form + Zod) | ✅ |
| Error inline en formulario (sin alert) | ✅ |
| Sección donaciones con link externo | ✅ |
| Mobile menu hamburguesa (Zustand + Motion) | ✅ |
| Animaciones scroll-reveal con Motion | ✅ |
| Fetch SWR con fallback a datos demo | ✅ |
| API routes con validación Zod | ✅ |
| Rate limiting in-memory (10 req/min) | ✅ |
| Error boundary global + 404 personalizada | ✅ |
| generateMetadata dinámico por evento | ✅ |
| cursor-pointer en todos los links y botones | ✅ |

## Variables de entorno

```bash
cp .env.example .env.local
```

| Variable | Descripción |
|---|---|
| `MONGODB_URI` | URI de conexión a MongoDB |
| `NEXT_PUBLIC_DONATIONS_URL` | URL de la plataforma de donaciones |
| `NEXT_PUBLIC_VOLUNTEER_FORM_URL` | Si se setea, reemplaza el formulario inline por redirección externa |
| `ADMIN_TOKEN_SECRET` | Secreto para firmar cookies de sesión |

## Scripts

```bash
npm run dev          # Desarrollo (http://localhost:3000)
npm run build        # Build de producción
npm run start        # Servir build
npm run lint         # ESLint
npm run typecheck    # TypeScript type checking
npm run test         # Tests (Vitest)
npm run test:watch   # Tests en modo watch
```

## Paleta de colores

| Token | Hex | Uso |
|---|---|---|
| `navy` | `#102542` | Fondos oscuros, textos principales |
| `coral` | `#f87060` | CTAs, acentos |
| `muted` | `#cdd7d6` | Fondos secundarios, bordes |
| `taupe` | `#b3a394` | Textos secundarios |
| `white` | `#ffffff` | Fondos de secciones |
