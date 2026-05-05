# Deploy a Vercel — Sol Perfumes Árabes

Guía para hacer el primer deploy a producción **paso a paso**, en orden, sin
saltarse nada. Tiempo estimado: **30–45 min** la primera vez.

---

## Resumen del stack en producción

| Servicio                 | Para qué                                  | Coste inicial            |
| ------------------------ | ----------------------------------------- | ------------------------ |
| Vercel                   | Hosting + CDN + serverless                | Gratis (Hobby) / $20 Pro |
| Neon                     | Postgres 16 con branching                 | Gratis hasta 0.5 GB      |
| Stripe                   | Pagos + webhooks                          | 1.4 % + 0.25 €           |
| Resend                   | Email transaccional                       | Gratis hasta 3.000/mes   |
| Upstash Redis            | Rate limiting (opcional)                  | Gratis                   |
| MapTiler                 | Tiles dark del mapa de ferias             | Gratis hasta 100k/mes    |
| Cloudflare               | DNS + WAF + cache                         | Gratis                   |

**Total para arrancar: 0 €/mes** (con tier Hobby de Vercel).

---

## Paso 0 — Antes de empezar

Necesitas tener:

- [ ] Cuenta de **GitHub** (para alojar el repo)
- [ ] Cuenta de **Vercel** vinculada a GitHub
- [ ] Tarjeta para Stripe (no se cobra, solo verificación)
- [ ] Un **dominio** (puede ser temporal: `solperfumes-test.vercel.app`)

---

## Paso 1 — Subir el repo a GitHub

El repo está ahora en una rama `claude/sol-perfumes-ecommerce-Nl3oS` de un sandbox. Hay que llevarlo a GitHub.

```bash
# Desde tu máquina local con el código clonado:
git remote remove origin
git remote add origin git@github.com:TU-USUARIO/sol-perfumes.git
git checkout claude/sol-perfumes-ecommerce-Nl3oS
git checkout -b main
git push -u origin main
```

> Si prefieres mantener el branch original como referencia, haz `git push origin claude/sol-perfumes-ecommerce-Nl3oS` también.

---

## Paso 2 — Crear la base de datos (Neon)

1. Ve a [console.neon.tech](https://console.neon.tech) → **New Project**.
2. Nombre: `sol-perfumes`. Región: `Frankfurt (eu-central-1)`. Postgres 16.
3. Una vez creado, dashboard → **Connection Details**:
   - Modo **Pooled** → copia la URL → será `DATABASE_URL`.
   - Modo **Direct** → copia la URL → será `DIRECT_URL`.
4. Las URLs deben terminar en `?sslmode=require`. La pooled añade `&pgbouncer=true`.

---

## Paso 3 — Stripe

1. Crea cuenta en [stripe.com](https://stripe.com), completa el onboarding.
2. **Developers → API keys** → modo **Test** (después cambias a Live):
   - `STRIPE_SECRET_KEY` = `sk_test_...`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_test_...`
3. **Developers → Webhooks → Add endpoint** (deja esto para el paso 7, cuando tengas el dominio).
4. **Settings → Payment methods** → activa Apple Pay y Google Pay.

---

## Paso 4 — Resend

1. [resend.com](https://resend.com) → **Add Domain** → `solperfumesarabes.com`.
2. Configura los **registros DNS** que te muestre (SPF, DKIM, DMARC) en Cloudflare.
3. Espera la verificación (1–10 min).
4. **API Keys → Create** → `RESEND_API_KEY`.

> Mientras se verifica el dominio puedes usar `onboarding@resend.dev` como remitente para pruebas; cámbialo a tu dominio antes de ir a producción.

---

## Paso 5 — Servicios opcionales

Estos NO bloquean el deploy. Si no los configuras, el código degrada con gracia.

- **Upstash Redis** ([upstash.com](https://upstash.com)) → región europea → copia `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`.
- **MapTiler** ([cloud.maptiler.com](https://cloud.maptiler.com)) → API key gratis → `NEXT_PUBLIC_MAPTILER_KEY`. Si lo dejas vacío, el mapa usa los demo tiles (funcional pero no oscuros).
- **Sentry** ([sentry.io](https://sentry.io)) → New project Next.js → DSN, org, project, auth token.
- **PostHog** ([eu.posthog.com](https://eu.posthog.com)) → `NEXT_PUBLIC_POSTHOG_KEY`.

---

## Paso 6 — Importar el repo en Vercel

1. [vercel.com/new](https://vercel.com/new) → **Import Git Repository** → selecciona `sol-perfumes`.
2. Framework: detecta **Next.js** automáticamente.
3. Root directory: `./`.
4. **Build Command**: ⚠️ **el primer deploy** usa
   ```
   pnpm vercel-build:first-deploy
   ```
   (esto crea el esquema vía `prisma db push`).
   En deploys **siguientes** cambia a:
   ```
   pnpm vercel-build
   ```
   (que usa `prisma migrate deploy` — ver Paso 9).
5. **Install Command**: déjalo en automático (`pnpm install --frozen-lockfile`).

### Variables de entorno

En **Environment Variables**, añade (Production + Preview):

```bash
# Aplicación
NEXT_PUBLIC_APP_URL=https://tu-dominio.com

# Base de datos (Paso 2)
DATABASE_URL=postgresql://...?sslmode=require&pgbouncer=true
DIRECT_URL=postgresql://...?sslmode=require

# Auth.js (genera con: openssl rand -base64 32)
AUTH_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AUTH_URL=https://tu-dominio.com
AUTH_TRUST_HOST=true

# Admin inicial (lo crea el seed)
ADMIN_EMAIL=admin@solperfumesarabes.com
ADMIN_PASSWORD=cambiame-en-produccion

# Stripe (Paso 3) — webhook lo añadimos en Paso 7
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=    # se rellena en el paso 7
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Resend (Paso 4)
RESEND_API_KEY=re_...
EMAIL_FROM=Sol Perfumes <hola@solperfumesarabes.com>

# Crons (Vercel inyectará este header en /api/cron/*)
CRON_SECRET=$(openssl rand -base64 32)

# Opcionales
NEXT_PUBLIC_MAPTILER_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_WHATSAPP_NUMBER=34600000000
```

> `AUTH_SECRET` y `CRON_SECRET` deben ser **distintos** y largos. Genera con `openssl rand -base64 32`.

6. **Deploy**. Tarda ~3–5 min la primera vez.

---

## Paso 7 — Configurar el webhook de Stripe

Cuando termine el deploy y tengas tu URL (`xxx.vercel.app`):

1. Stripe → **Developers → Webhooks → Add endpoint**.
2. URL: `https://tu-dominio.com/api/stripe/webhook`.
3. Eventos a escuchar:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `checkout.session.async_payment_failed`
   - `charge.refunded`
4. Copia el **Signing secret** (`whsec_...`).
5. En Vercel → Project → Settings → Environment Variables → edita `STRIPE_WEBHOOK_SECRET`.
6. **Redeploy** (no hace falta nuevo commit; Settings → Deployments → ⋯ → Redeploy).

---

## Paso 8 — Sembrar la base de datos

El esquema ya se creó en el primer build con `db push`. Falta meter los 24 perfumes, 30 notas, 8 ferias y el admin.

Desde tu máquina local (con `.env` apuntando a la DB de producción):

```bash
# Solo esta vez. Después no vuelvas a correrlo.
pnpm prisma db seed
```

> ⚠️ **Importante**: comprueba que `DATABASE_URL` y `DIRECT_URL` en tu `.env` local apuntan a producción **solo durante el seed**. Después restáuralos a la DB de desarrollo.

---

## Paso 9 — Cambiar a migraciones (recomendado tras el primer deploy)

Ya con la DB en producción y datos sembrados, conviene que los siguientes deploys usen migraciones versionadas en vez de `db push`:

```bash
# En tu máquina local
pnpm prisma migrate dev --name init    # crea prisma/migrations/0001_init
git add prisma/migrations
git commit -m "chore: initial prisma migration"
git push
```

Y en Vercel cambia el **Build Command** de `pnpm vercel-build:first-deploy` a `pnpm vercel-build`. A partir de ahora cada cambio de schema se hace con `prisma migrate dev --name lo_que_cambias` y se aplicará automáticamente en el siguiente deploy.

---

## Paso 10 — Dominio personalizado

Vercel → Project → **Domains** → Add → `solperfumesarabes.com`.

En **Cloudflare** (o tu DNS):

| Tipo  | Host  | Valor                  | Proxy |
| ----- | ----- | ---------------------- | ----- |
| A     | @     | 76.76.21.21            | DNS only |
| CNAME | www   | cname.vercel-dns.com   | DNS only |

> Empieza con **DNS only** (no proxy de Cloudflare) hasta que el SSL de Vercel se aprovisione. Después puedes activar el proxy.

Cuando tengas el dominio:
- Actualiza `NEXT_PUBLIC_APP_URL` y `AUTH_URL` en Vercel a `https://solperfumesarabes.com`.
- Actualiza la URL del webhook de Stripe.
- Verifica el dominio de Resend si aún no estaba.

---

## Paso 11 — Smoke tests (todo verde antes de anunciar)

```bash
curl -I https://solperfumesarabes.com                    # 200
curl -I https://solperfumesarabes.com/sitemap.xml        # 200
curl https://solperfumesarabes.com/api/ferias/ical | head # BEGIN:VCALENDAR
```

Manual:

- [ ] Home carga en < 2 s · Lighthouse Performance ≥ 90.
- [ ] Login admin con `ADMIN_EMAIL` / `ADMIN_PASSWORD` redirige a `/admin/dashboard`.
- [ ] Crear una feria de prueba en `/admin/ferias/nueva` aparece en `/ferias`.
- [ ] Compra completa en modo test con tarjeta `4242 4242 4242 4242` → email de confirmación llega.
- [ ] Webhook Stripe muestra `200 OK` en su panel.

---

## Paso 12 — Pasar a Live (Stripe + dominio)

Cuando todo funcione en test:

1. **Stripe → Toggle Live mode**.
2. Repite el Paso 7 con keys live (`sk_live_…`, `whsec_…`).
3. Actualiza las variables `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` en Vercel.
4. **Redeploy**.
5. Haz un **pedido de prueba real** con tu propia tarjeta y reembólsalo desde el panel admin para verificar el flujo completo.

---

## Crons configurados

`vercel.json` programa tres crons (Vercel los activa automáticamente al detectarlos):

| Endpoint                          | Cuándo                | Para qué                                  |
| --------------------------------- | --------------------- | ----------------------------------------- |
| `/api/cron/abandoned-carts`       | 10:00 UTC diario      | Email recordatorio de carritos 24h        |
| `/api/cron/review-requests`       | 11:00 UTC diario      | Pedir reseña 7 días después de entrega    |
| `/api/cron/fair-reminders`        | 09:00 UTC lunes       | Avisar de ferias en los próximos 7-14d    |

Todos requieren `CRON_SECRET` configurado en Vercel.

---

## Backups

- **Neon**: backups continuos + point-in-time recovery 7 días en plan gratuito; 30 días en Pro.
- **Stripe**: ledger inmutable.
- **Vercel**: cada commit es un deploy versionado.

---

## Despliegues siguientes

Para deploys posteriores: solo `git push origin main`. Vercel detecta y construye.

Si cambias el schema: `pnpm prisma migrate dev --name X` localmente, commit, push.

Si añades una variable de entorno nueva: Vercel → Settings → Env Vars → **Redeploy**.

---

## Troubleshooting

| Síntoma                                         | Causa probable / fix                                                            |
| ----------------------------------------------- | ------------------------------------------------------------------------------- |
| Build falla con `Invalid environment variables` | Falta una env var requerida — revisa `lib/env.ts`.                              |
| Build falla con `P3009` o `P1001`               | `DATABASE_URL` mal · sin `?sslmode=require` · pooler/direct intercambiados.     |
| `/admin` redirige a `/cuenta/iniciar-sesion`    | Normal: tu sesión no es admin. Loguéate con `ADMIN_EMAIL` o sube tu rol en DB.  |
| Stripe webhook devuelve 400                     | `STRIPE_WEBHOOK_SECRET` no coincide con el del endpoint en Stripe.              |
| Imagen no carga                                 | El host del CDN no está en `next.config.ts → images.remotePatterns`.            |
| El cron 401                                     | `CRON_SECRET` no configurado o `vercel.json` no es válido.                      |
