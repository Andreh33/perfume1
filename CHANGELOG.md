# Changelog

Todas las versiones notables se documentarán aquí.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [0.1.0] — 2026-05-05

### Añadido

- Setup inicial: Next.js 16 · React 19 · TypeScript estricto · Tailwind v4.
- Sistema de diseño con paleta OKLCH, dorado metalizado y tipografías Cormorant / Manrope / Cinzel / Amiri.
- Schema Prisma completo: User, Address, Product, ProductVariant, ProductImage, OlfactiveNote, ProductNote, Collection, Cart, Order, OrderItem, Coupon, Review, Wishlist, BlogPost, **PerfumeFair**, NewsletterSubscriber, Setting, AuditLog, MediaAsset.
- Seed con 1 admin, 24 productos, 30 notas, 6 colecciones, 8 ferias, 6 posts, 10 reseñas y settings iniciales.
- Auth.js v5 con Credentials (argon2id), Google OAuth y soporte 2FA TOTP.
- Stripe Checkout con webhook firmado y decremento de stock automático.
- next-intl con ES / EN / AR (RTL completo en árabe).
- Páginas públicas: home, catálogo, ficha producto, ferias (lista + ICS), blog, historia, contacto, notas olfativas, colecciones, 4 páginas legales.
- Carrito, checkout en una página, confirmación con animación dorada, cuenta cliente.
- Panel admin: dashboard con KPIs, productos, ferias (CRUD completo con i18n), pedidos.
- API routes: auth, stripe webhook, ical, search, newsletter, contact, cart updates.
- SEO: sitemap dinámico, robots, manifest, OG dinámico, JSON-LD (Organization, Product, Event), hreflang.
- Headers de seguridad estrictos (HSTS, CSP-ready, Permissions-Policy).
- Rate limiting con Upstash Redis (auth, newsletter, contact).
- Tests unitarios (Vitest) de cálculo de carrito y utilidades.
- E2E (Playwright) de home y feed ICS.
- CI con GitHub Actions: lint + typecheck + test + build con servicio Postgres.
- Documentación: README, DEPLOY, AGENTS.
