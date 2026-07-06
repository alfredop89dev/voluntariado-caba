<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Red de Voluntarios en CABA por Venezuela

## Propósito del proyecto
Landing page + plataforma para gestionar voluntarios, eventos y donaciones destinadas a ayudar a las víctimas del terremoto en Venezuela. La comunidad está radicada en CABA (Buenos Aires) y organiza eventos de recaudación, acopio y difusión.

## Stack técnico
- **Next.js 16** (App Router) + React 19 + TypeScript + Tailwind CSS 4
- **MongoDB** + Mongoose (base de datos)
- **SWR** (data fetching client-side), **Zustand** (estado global)
- **Motion** (animaciones), **react-hook-form** + **Zod** (forms + validación)

## Estado actual del proyecto
Landing page completamente funcional con datos demo + panel admin completo con autenticación HMAC, CRUD de eventos, gestión de voluntarios y usuarios.

### Features implementadas
- Hero con gradiente navy + 8 estrellas SVG animadas
- Calendario de eventos agrupados por fecha + paginación
- Página de detalle `/events/[id]` con hero propio + skeleton loading
- Formulario de voluntariado inline (react-hook-form + validación Zod)
- Sección donaciones con link externo
- API REST con validación Zod + rate limiting (público 10/min, admin 30/min)
- Error boundary global + 404 personalizada
- Mobile menu hamburguesa (Zustand)
- Scroll-reveal animations (Motion FadeIn)
- Panel admin con sidebar y autenticación HMAC + cookie httpOnly
- Dashboard con métricas (eventos, voluntarios, usuarios, próximos eventos)
- CRUD completo de eventos (crear, editar, eliminar, buscar, paginar, CSV)
- Estados de eventos: activo, pendiente, pospuesto, cerrado
- Gestión de voluntarios con filtros por estado, búsqueda, cambio de estado inline y CSV
- CRUD de usuarios admin con búsqueda y protección anti auto-eliminación
- Expiración de sesión verificada server-side
- Subida de imágenes a Cloudinary (drag & drop)
- Toast system para feedback (success/error/info)
- i18n es/en completo en landing y admin
- Tests unitarios (Vitest): auth, rate-limiter, schemas, utils

### Pendientes / próximos pasos
- Subida de imágenes (Cloudinary/S3) — parcial (componente listo, falta integración con API admin)
- SEO (sitemap.xml, robots.txt) — básico implementado
- Middleware de rate limiting con Redis (producción)
- Optimización de imágenes con next/image remotePatterns
- E2E tests con Playwright para admin

## Estructura clave
```
src/
├── app/
│   ├── admin-voluntariado-eventos/    # Panel admin
│   │   ├── dashboard/                 # Dashboard con métricas
│   │   ├── login/                     # Login
│   │   ├── usuarios/                  # CRUD usuarios
│   │   ├── voluntarios/               # Gestión voluntarios
│   │   ├── page.tsx                   # CRUD eventos
│   │   └── layout.tsx                 # Sidebar + auth
│   ├── api/
│   │   ├── admin/                     # API protegida
│   │   │   ├── events/                # CRUD eventos
│   │   │   ├── login/                 # Login/logout
│   │   │   ├── users/                 # CRUD usuarios
│   │   │   ├── verify/                # Verificar sesión
│   │   │   └── volunteers/            # CRUD voluntarios
│   │   ├── events/                    # API pública
│   │   └── volunteers/                # API pública
│   └── events/[id]/                   # Detalle evento
├── components/
│   ├── layout/                        # Header, Footer
│   ├── sections/                      # Secciones landing
│   └── ui/                            # modal, confirm-dialog, toast, image-upload, etc.
├── hooks/                             # SWR hooks
├── lib/
│   ├── __tests__/                     # Unit tests
│   ├── i18n/                          # Traducciones es/en
│   ├── models/                        # Mongoose schemas
│   └── ... (config, auth, utils, etc.)
└── stores/                            # Zustand stores
```

## Paleta Coolors
- Navy: `#102542`
- Coral: `#f87060`
- Muted: `#cdd7d6`
- Taupe: `#b3a394`
- White: `#ffffff`

## Comandos útiles
```bash
npm run dev       # Desarrollo
npm run build     # Build + typecheck
npm run lint      # ESLint
npm run test      # Tests (Vitest)
```

## Notas

### MongoDB requerido
El sitio requiere `MONGODB_URI` configurado en `.env.local`. Sin conexión a MongoDB las API routes devuelven 503.

### Hydration
Next.js 16 + Turbopack puede agregar atributos `__processed_*` al `<body>`. Se manejó con `suppressHydrationWarning`.

### Rate limiting
- Rutas públicas POST: 10 requests/minuto por IP (en memoria)
- Rutas admin POST/PUT/PATCH/DELETE: 30 requests/minuto por IP (en memoria)
- Para producción migrar a Redis/Vercel KV.

### Sesión admin
Autenticación basada en HMAC-SHA256. El token incluye timestamp y se valida server-side contra `ADMIN.SESSION_MAX_AGE` (default 24h). El primer usuario se crea automáticamente si la DB está vacía.
