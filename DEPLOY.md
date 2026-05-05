# Despliegue — Sol Perfumes Árabes

## Vista general

Stack recomendado:

- **Vercel** (build + hosting + CDN + análisis)
- **Neon** o **Supabase** (Postgres 16, branching)
- **Resend** (email transaccional)
- **Stripe** (pagos + webhooks)
- **UploadThing** o **Cloudflare R2** (media)
- **Upstash Redis** (rate limiting)
- **Sentry** (errores)
- **Cloudflare** (DNS, WAF)

---

## 1. Base de datos (Neon)

1. Crea un proyecto Neon con Postgres 16 en la región `eu-central-1`.
2. Crea dos roles: `app_user` (con pooling) y `migrator` (sin pooling).
3. Copia ambas connection strings:
   - `DATABASE_URL` → la de `app_user` con pooling (`?pgbouncer=true&sslmode=require`).
   - `DIRECT_URL` → la de `migrator` (`?sslmode=require`).
4. Activa el branching para feature branches en Vercel.

---

## 2. Stripe

1. Crea cuenta y completa onboarding con datos fiscales.
2. En **Developers → API keys** copia `STRIPE_SECRET_KEY` y `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. En **Developers → Webhooks**, añade endpoint:
   - URL: `https://solperfumesarabes.com/api/stripe/webhook`
   - Eventos:
     - `checkout.session.completed`
     - `checkout.session.expired`
     - `checkout.session.async_payment_failed`
     - `charge.refunded`
4. Copia `STRIPE_WEBHOOK_SECRET` (`whsec_…`).
5. Habilita Apple Pay y Google Pay en **Settings → Payment methods**.

---

## 3. Resend

1. Crea cuenta y verifica el dominio `solperfumesarabes.com`.
2. Añade los registros DNS (SPF, DKIM, DMARC) — Resend te los muestra en pantalla.
3. Genera API key y guárdala en `RESEND_API_KEY`.
4. Configura `EMAIL_FROM="Sol Perfumes <hola@solperfumesarabes.com>"`.

---

## 4. UploadThing (o Cloudflare R2)

UploadThing tiene zero-config. Crea proyecto, copia `UPLOADTHING_TOKEN` y `UPLOADTHING_SECRET`.

Si prefieres R2:

1. Crea bucket `sol-perfumes-media` en Cloudflare.
2. Configura Access Key + Secret y un dominio personalizado público (`cdn.solperfumesarabes.com`).
3. Añade el host en `images.remotePatterns` de `next.config.ts`.

---

## 5. Upstash Redis

1. Crea base de datos Redis (región europea).
2. Copia `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`.

---

## 6. Sentry

1. Crea proyecto Next.js.
2. Configura DSN, org, project, auth token.
3. El plugin de Sentry para Next se integra en CI vía `SENTRY_AUTH_TOKEN`.

---

## 7. Vercel

1. Importa el repo desde GitHub.
2. Framework: **Next.js**.
3. Project root: la raíz del repo.
4. Build command: `pnpm build` · Install command: `pnpm install --frozen-lockfile`.
5. Añade **todas** las variables del `.env.example` en Production y Preview.
6. Conecta dominio `solperfumesarabes.com` en **Domains**.
7. Configura DNS en Cloudflare:
   - `A` apex → IP de Vercel
   - `CNAME www` → `cname.vercel-dns.com`

### Migraciones automáticas en deploy

Asegúrate de que `package.json` ejecuta `prisma migrate deploy` antes del build:

```jsonc
"scripts": {
  "vercel-build": "prisma migrate deploy && next build"
}
```

Y en Vercel cambia el build command a `pnpm vercel-build`.

> Para evitar deploys destructivos, mantén una **policy de migraciones aditivas**: nunca borres columnas en una sola release; primero deja de leerlas en código, luego haz una migración separada.

---

## 8. DNS y dominio

| Tipo  | Host  | Valor                  |
| ----- | ----- | ---------------------- |
| A     | @     | 76.76.21.21 (Vercel)   |
| CNAME | www   | cname.vercel-dns.com   |
| TXT   | @     | (Resend SPF + DMARC)   |
| MX    | @     | (configurar fastmail/google workspace) |

---

## 9. Backups

- **Neon**: backups continuos + point-in-time recovery 7 días.
- **Stripe**: ledger inmutable.
- **Cloudflare R2**: versionado de bucket activado.

Configura un cron Vercel diario que llame `/api/admin/backup` (no incluido en este boilerplate; añade rutina si lo necesitas).

---

## 10. Smoke tests post-deploy

1. ¿Carga la home en < 2 s?  → Lighthouse en Chrome incógnito.
2. ¿`/api/ferias/ical` devuelve `text/calendar`?
3. ¿`/sitemap.xml` lista productos y ferias?
4. ¿Login con admin redirige a `/admin/dashboard`?
5. ¿Una compra de prueba con tarjeta `4242 4242 4242 4242` → `checkout.session.completed` → estado `PAID` en pedido?

Si los 5 pasan, listo para vender.
