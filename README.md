# Red de Voluntarios — Landing Page + Admin Panel

Sitio web para la **Red de Voluntarios en CABA por Venezuela**, desarrollado como apoyo a las víctimas del terremoto en Venezuela. Plataforma de gestión de voluntarios, eventos y donaciones con panel de administración.

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
│   ├── admin-voluntariado-eventos/          # Panel admin (protegido)
│   │   ├── dashboard/page.tsx              # Dashboard con métricas
│   │   ├── login/page.tsx                  # Login con HMAC session
│   │   ├── usuarios/page.tsx               # CRUD usuarios admin
│   │   ├── voluntarios/page.tsx            # Gestión de solicitudes
│   │   ├── page.tsx                        # CRUD eventos
│   │   └── layout.tsx                      # Sidebar + auth check
│   ├── api/
│   │   ├── admin/                          # API routes protegidas
│   │   │   ├── events/                     # CRUD eventos (GET, POST)
│   │   │   │   ├── [id]/route.ts           # PUT, DELETE
│   │   │   │   └── route.ts
│   │   │   ├── login/route.ts             # Login/logout con cookie
│   │   │   ├── users/                      # CRUD usuarios admin
│   │   │   │   ├── [id]/route.ts
│   │   │   │   └── route.ts
│   │   │   ├── verify/route.ts            # Verificación de sesión
│   │   │   └── volunteers/
│   │   │       ├── [id]/route.ts          # PATCH status, DELETE
│   │   │       └── route.ts
│   │   ├── events/                        # API pública (GET, POST con rate limit)
│   │   │   └── [id]/route.ts
│   │   └── volunteers/                    # API pública (POST con rate limit)
│   │       └── route.ts
│   ├── events/[id]/                       # Detalle público de evento
│   │   ├── loading.tsx                    # Skeleton loading
│   │   └── page.tsx
│   ├── error.tsx                          # Error boundary global
│   ├── globals.css                        # Tailwind v4 + temas
│   ├── layout.tsx                         # Root layout
│   ├── not-found.tsx                      # 404 personalizada
│   └── page.tsx                           # Landing page
├── components/
│   ├── layout/
│   │   ├── footer.tsx
│   │   └── header.tsx                     # Nav + menú mobile (Zustand)
│   ├── sections/
│   │   ├── about-section.tsx              # Quiénes somos
│   │   ├── calendar-section.tsx           # Calendario agrupado por fecha
│   │   ├── donations-section.tsx
│   │   ├── hero.tsx                       # Hero con gradiente + 8 estrellas SVG
│   │   ├── volunteer-form.tsx             # Formulario react-hook-form
│   │   └── volunteer-section.tsx
│   └── ui/
│       ├── button.tsx                     # Motion-animated (3 variants)
│       ├── confirm-dialog.tsx             # Confirmación con variante danger
│       ├── fade-in.tsx                    # Scroll reveal wrapper
│       ├── image-preview.tsx              # Preview con next/image
│       ├── image-upload.tsx               # Upload Cloudinary drag & drop
│       ├── modal.tsx                      # Modal animado con Escape key
│       ├── pagination.tsx                 # Paginación reutilizable
│       ├── skeleton.tsx                   # Skeleton shimmer
│       └── toast.tsx                      # Toast success/error/info
├── hooks/
│   ├── use-events.ts                      # SWR fetch eventos
│   └── use-volunteer.ts                   # SWR mutation voluntarios
├── lib/
│   ├── i18n/
│   │   ├── config.ts                      # Tipos y locale default
│   │   ├── en.json                        # Traducciones inglés
│   │   ├── es.json                        # Traducciones español
│   │   └── translations-context.tsx        # Context + Provider + useI18n
│   ├── models/
│   │   ├── event.ts                       # Schema: title, date, status, location, etc.
│   │   ├── user.ts                        # Schema: username, password (scrypt), role
│   │   └── volunteer.ts                   # Schema: name, email, phone, skills, status
│   ├── __tests__/                         # Tests unitarios (Vitest)
│   │   ├── auth.test.ts                   # createToken / verifyToken / expiración
│   │   ├── rate-limiter.test.ts           # checkRateLimit / checkAdminRateLimit
│   │   ├── schemas.test.ts                # Validación Zod
│   │   └── utils.test.ts                  # cn()
│   ├── api-utils.ts                       # fetchJson, mapEvent, formatDate
│   ├── auth.ts                            # HMAC-SHA256 tokens
│   ├── auth-utils.ts                      # checkAuth server-side
│   ├── config.ts                          # Constantes compartidas
│   ├── demo-events.ts                     # Eventos demo offline
│   ├── get-event.ts                       # Server: get event by ID
│   ├── mongodb.ts                         # Conexión singleton
│   ├── rate-limiter.ts                    # Rate limit in-memory (público 10/min, admin 30/min)
│   ├── schemas.ts                         # Validación Zod
│   └── utils.ts                           # cn() utility
└── stores/
    ├── admin-store.ts                     # Zustand: auth state admin
    └── ui-store.ts                        # Zustand: menú mobile
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
| Panel admin con sidebar y auth | ✅ |
| Login con HMAC session + cookie httpOnly | ✅ |
| Dashboard con métricas de eventos, voluntarios y usuarios | ✅ |
| CRUD completo de eventos (crear, editar, eliminar) | ✅ |
| Búsqueda y paginación en tabla de eventos | ✅ |
| Exportar eventos a CSV | ✅ |
| Estado de eventos (activo, pendiente, pospuesto, cerrado) | ✅ |
| Gestión de solicitudes de voluntarios con filtros | ✅ |
| Cambio de estado (pendiente → contactado → aprobado/rechazado) | ✅ |
| Búsqueda en solicitudes de voluntarios | ✅ |
| Exportar voluntarios a CSV | ✅ |
| CRUD de usuarios admin con búsqueda | ✅ |
| Protección contra auto-eliminación de usuario | ✅ |
| Expiración de sesión verificada server-side | ✅ |
| Rate limiting en rutas admin (30 req/min) | ✅ |
| i18n español/inglés en landing y admin | ✅ |
| Tests unitarios (auth, rate-limiter, schemas) | ✅ |

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
| `ADMIN_SESSION_MAX_AGE` | Duración de sesión en segundos (default: 86400 = 24h) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloud Name para subir imágenes |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Upload preset de Cloudinary |

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
