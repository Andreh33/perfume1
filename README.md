# Sol Perfumes Árabes — E-commerce

E-commerce de lujo de perfumes árabes de nicho construido con **Next.js 16 (App Router) + React 19 + TypeScript estricto + Tailwind CSS v4 + Prisma + Postgres + Stripe + Auth.js v5 + next-intl** (ES / EN / AR con RTL completo).

> Diseñado para Sol Perfumes Árabes. Stack 2026, código production-ready, sin placeholders.

---

## Stack principal

| Capa            | Tecnología                                                |
| --------------- | --------------------------------------------------------- |
| Framework       | Next.js 16 (App Router, React 19, React Compiler, PPR)    |
| Estilos         | Tailwind CSS v4 (CSS-first con `@theme`) · OKLCH          |
| UI primitives   | shadcn/ui · Radix UI · Lucide                             |
| Motion          | Motion (motion.dev)                                       |
| Tipografía      | Cormorant Garamond · Manrope · Cinzel · Amiri             |
| Base de datos   | PostgreSQL 16 + Prisma                                    |
| Auth            | Auth.js v5 (Credentials + Google + magic-link, 2FA TOTP)  |
| Pagos           | Stripe (Checkout + webhooks)                              |
| Email           | Resend + React Email                                      |
| i18n            | next-intl (es / en / ar con RTL)                          |
| Búsqueda        | Meilisearch (opcional) o `pg_trgm`                        |
| Testing         | Vitest · Playwright · Testing Library                     |
| CI              | GitHub Actions (lint, typecheck, test, build, E2E)        |
| Lint / Format   | Biome                                                     |
| Observabilidad  | Sentry · Vercel Analytics · PostHog                       |

---

## Requisitos

- Node ≥ 22
- pnpm ≥ 9
- PostgreSQL 16 (local o Neon / Supabase)
- Cuenta Stripe (modo test)
- Cuenta Resend (DNS configurado)

---

## Setup local

```bash
# 1. Instalar dependencias
pnpm install

# 2. Copiar variables de entorno
cp .env.example .env
# … edita .env con tus credenciales (mínimo: DATABASE_URL, AUTH_SECRET, STRIPE_*)

# 3. Generar Prisma client + crear esquema
pnpm db:push

# 4. Sembrar datos demo (admin, 24 productos, 30 notas, 6 colecciones, 8 ferias…)
pnpm db:seed

# 5. Arrancar
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

Credenciales del admin sembrado:
- Email: `admin@solperfumesarabes.com` (o `ADMIN_EMAIL` de `.env`)
- Contraseña: la de `ADMIN_PASSWORD` (`ChangeMe!Now-2026` por defecto — **cámbiala**)

---

## Comandos útiles

| Comando            | Descripción                                |
| ------------------ | ------------------------------------------ |
| `pnpm dev`         | Servidor de desarrollo (Turbopack)         |
| `pnpm build`       | Build de producción                        |
| `pnpm start`       | Servidor de producción                     |
| `pnpm lint`        | Biome                                      |
| `pnpm typecheck`   | TypeScript strict, sin emit                |
| `pnpm test`        | Vitest (unit)                              |
| `pnpm e2e`         | Playwright (E2E)                           |
| `pnpm db:push`     | Sincroniza schema con la DB (dev)          |
| `pnpm db:migrate`  | Crea y aplica migraciones                  |
| `pnpm db:seed`     | Carga datos demo                           |
| `pnpm db:studio`   | Prisma Studio                              |
| `pnpm email:dev`   | Preview de plantillas React Email          |

---

## Estructura

```
app/
├── (marketing)/          → home, perfumes, ferias, blog, historia, contacto, legales
├── (shop)/               → carrito, checkout, confirmación, cuenta cliente
├── admin/                → panel admin (dashboard, productos, ferias, pedidos…)
├── api/                  → auth, stripe webhook, ical, search, newsletter, contact
├── actions/              → Server Actions (cart, checkout, fairs)
├── globals.css           → tokens OKLCH, fuentes, animaciones
├── layout.tsx            → root layout (next-intl, fuentes, JSON-LD)
├── sitemap.ts · robots.ts · manifest.ts
└── opengraph-image.tsx   → OG dinámico

components/
├── ui/                   → primitives shadcn/Radix
├── shared/               → Header, Footer, Topbar, Logo
├── marketing/            → Hero, Marquee, OlfactivePyramid, SectionHeader
├── shop/                 → ProductCard
├── ferias/               → FairCard
└── admin/                → (DataTable, AdminForm — extensible)

lib/
├── prisma.ts · auth.ts · stripe.ts · env.ts
├── cart.ts               → cálculo de totales, cupones, IVA
├── seo.ts · rate-limit.ts · utils.ts
├── i18n/{config,request}.ts
└── validations/          → esquemas Zod (product, fair…)

prisma/
├── schema.prisma         → 20+ modelos · soft-delete · auditoría
└── seed.ts               → admin + 24 productos + 30 notas + 6 colecciones + 8 ferias + 6 posts

messages/{es,en,ar}.json  → cadenas de UI
public/                   → fuentes locales, iconos de notas, patrones
tests/{unit,e2e}/         → Vitest + Playwright
```

---

## Funcionalidades

### Tienda pública

- Home con hero, marquee, colecciones destacadas, bestsellers, pirámide olfativa, próximas ferias y newsletter.
- Catálogo `/perfumes` con filtros (familia, género, colección, nota), orden y paginación.
- Ficha de producto con galería, pirámide olfativa, reseñas, JSON-LD `Product` + `AggregateRating`.
- Calendario de ferias `/ferias` con filtros y export ICS público (`/api/ferias/ical`).
- Blog · Notas olfativas · Colecciones · Historia · Contacto · 4 páginas legales.
- Carrito persistente (cookie sessionKey), checkout en una página, Stripe Checkout, confirmación.
- Cuenta cliente: pedidos, direcciones, favoritos, ajustes.
- i18n ES/EN/AR con RTL automático en árabe.

### Panel admin (`/admin`)

- Dashboard con KPIs (ventas hoy/mes, pedidos pendientes, stock crítico).
- CRUD productos, ferias, pedidos.
- Audit log inmutable de cambios admin.
- Acceso protegido por middleware (rol ADMIN/STAFF).

### Seguridad

- Headers (HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff, Permissions-Policy, Referrer-Policy).
- argon2id para contraseñas.
- Validación Zod en cliente y servidor.
- Rate limiting (Upstash Redis) en login, newsletter y contacto.
- Verificación de firma Stripe en webhook.
- Variables de entorno tipadas (`lib/env.ts`).

### SEO

- Metadata API en cada ruta, canonicals y `hreflang` ES/EN/AR.
- Sitemap dinámico con productos, ferias, colecciones y posts.
- JSON-LD: Organization · Product · AggregateRating · Event · BreadcrumbList.
- OG image dinámica (`/opengraph-image`).

---

## Despliegue

Ver [`DEPLOY.md`](./DEPLOY.md).

---

## Notas

- El proyecto está pensado para Vercel + Neon/Supabase + Resend + Stripe.
- El admin **no es un CMS genérico**: cada pantalla está diseñada para Sol Perfumes Árabes.
- El dorado nunca es plano — siempre gradiente metalizado en `--color-gold-deep → gold → gold-bright`.
- El negro nunca es `#000` — base OKLCH `oklch(0.14 0.015 60)`.
- Respeta `prefers-reduced-motion` en todas las animaciones.

## Licencia

Propietaria · © Sol Perfumes Árabes. Todos los derechos reservados.
