# AGENTS.md — Convenciones para agentes IA en este repositorio

> Este archivo sigue la convención **AGENTS.md** de Next 16 / Vercel. Léelo antes
> de modificar código.

## Stack

- Next.js 16 (App Router · React 19 · React Compiler · PPR)
- TypeScript estricto (sin `any`)
- Tailwind CSS v4 con `@theme` en `app/globals.css`
- Prisma 6 + Postgres 16
- Auth.js v5 · Stripe · next-intl
- Biome (lint + format) — NO mezclar con ESLint/Prettier

## Reglas de oro

1. **Nada de `any`.** Si un tipo es ambiguo, modélalo. Usa `unknown` y refina.
2. **Nada de `console.log` en código de producción.** Usa Sentry o logs estructurados.
3. **Nada de comentarios redundantes** que repitan lo que el código ya dice.
4. **Server first.** Componentes son Server por defecto; añade `"use client"` solo cuando haga falta interactividad.
5. **Server Actions** para mutaciones; las API routes solo para integraciones externas (Stripe webhook, OAuth, ICS, búsqueda).
6. **Validación Zod** en CADA frontera (cliente y servidor).
7. **`use cache` + `cacheTag`** para datos cacheables; revalidación con `revalidateTag`.
8. **Internacionalización**: las cadenas viven en `messages/{es,en,ar}.json`. Nunca hard-code.
9. **Diseño**: usa los tokens de `globals.css`. El dorado SIEMPRE con gradiente. El negro NUNCA es `#000`.
10. **Accesibilidad**: focus dorado visible, `aria-label` en botones-icono, `prefers-reduced-motion`.

## Estructura

- `app/(marketing)` → web pública, layout con Topbar/Header/Footer.
- `app/(shop)` → carrito, checkout, cuenta cliente.
- `app/admin` → panel protegido por middleware.
- `app/api` → integraciones externas y endpoints con respuesta especial.
- `app/actions` → Server Actions agrupadas por dominio.
- `lib/` → utilidades server (`prisma`, `auth`, `stripe`, `cart`, `seo`, `rate-limit`, `validations/*`).
- `components/ui` → primitives shadcn/Radix.
- `components/{shared,marketing,shop,ferias,admin}` → feature components.
- `prisma/schema.prisma` → modelo de datos. Añade índices a relaciones y campos de búsqueda.

## Nombres

- Slugs y URLs: `kebab-case` (ES por defecto, ej. `/perfumes`, `/ferias`).
- Variables: `camelCase`. Tipos / componentes: `PascalCase`.
- Tabla Prisma: `PascalCase` singular (`Product`). Campo: `camelCase`.
- Enum Prisma: SCREAMING_SNAKE (`OrderStatus.PROCESSING`).

## Pagos

- Todo en céntimos (Int) en BD. Formato sólo en presentación (`formatPriceCents`).
- Cupones tipo PERCENT: valor en **basis points** (10000 = 100 %).
- Stock se decrementa en `checkout.session.completed`, no antes.

## Testing

- Vitest + Testing Library para unidades y componentes presentacionales.
- Playwright para flujos críticos (compra, login, CRUD admin).
- Lógica de cálculo de pedidos exige cobertura 100 %.

## Pull requests

- Una PR = un cambio. Añade tests para cualquier lógica nueva.
- Antes de mergear: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.

## NO hacer

- No introducir librerías que dupliquen lo que ya hay (ej.: no traer Zustand si Server Actions bastan).
- No mezclar Tailwind con CSS Modules salvo casos puntuales muy justificados.
- No modificar el schema sin migración.
- No hacer commits que rompan `pnpm build`.
