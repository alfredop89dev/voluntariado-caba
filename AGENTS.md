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
El proyecto tiene la landing page completamente funcional con datos demo. Sin conexión a MongoDB, usa `fallbackData` con 4 eventos demo. Con MongoDB configurado, usa las API routes.

### Features implementadas
- Hero con gradiente navy + 8 estrellas SVG animadas
- Calendario de eventos agrupados por fecha + paginación (2 fechas/página)
- Página de detalle `/events/[id]` con hero propio + skeleton loading
- Formulario de voluntariado inline (react-hook-form + validación Zod)
- Sección donaciones con link externo
- API REST con validación Zod + rate limiting in-memory
- Error boundary global + 404 personalizada
- Mobile menu hamburguesa (Zustand)
- Scroll-reveal animations (Motion FadeIn)

### Pendientes / próximos pasos
- Autenticación (NextAuth) para admin de eventos
- Panel admin CRUD de eventos con UI
- Tests (Vitest + Playwright)
- Sistema de toasts para feedback
- i18n (es/en)
- Subida de imágenes (Cloudinary/S3)
- SEO (sitemap.xml, robots.txt)
- Middleware de rate limiting con Redis (producción)
- Optimización de imágenes con next/image remotePatterns

## Estructura clave
```
src/
├── app/api/events/         # CRUD eventos
├── app/api/volunteers/     # CRUD voluntarios
├── app/events/[id]/        # Detalle de evento
├── components/sections/    # Secciones de la landing
├── components/ui/          # Componentes reutilizables
├── hooks/                  # SWR hooks
├── lib/                    # Modelos, schemas Zod, utils
└── stores/                 # Zustand stores
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
```

## Notas

### MongoDB requerido
El sitio requiere `MONGODB_URI` configurado en `.env.local`. Sin conexión a MongoDB las API routes devuelven 503.

### Hydration
Next.js 16 + Turbopack puede agregar atributos `__processed_*` al `<body>`. Se manejó con `suppressHydrationWarning`.

### Rate limiting
Las rutas POST tienen rate limit de 10 requests/minuto por IP (en memoria). Para producción migrar a Redis/Vercel KV.
