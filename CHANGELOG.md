# Changelog

Todas las versiones notables se documentarán aquí.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [0.2.0] — 2026-05-05

### Añadido

- **Plantillas React Email** completas: shell de marca compartido + Welcome, OrderConfirmation, OrderShipped, PasswordReset, EmailVerification, AbandonedCart, ReviewRequest, StockNotification, FairReminder, NewsletterMonthly. Wrapper `lib/email/index.ts` con render server-only y fallback dev.
- **OG dinámico por producto y por feria** (`opengraph-image.tsx`) con composición tipográfica y dorada.
- **Search Cmd+K** (`SearchCommand`) con cmdk: atajo `⌘K` / `/`, debounce, agrupación productos/ferias/blog, navegación por teclado y rápida.
- **Vista Calendario y Mapa** en `/ferias` (FairsCalendarView con date-fns y FairsMapView con MapLibre + MapTiler), parámetro `?view=list|calendar|map`.
- **Galería Embla** en la ficha de producto: thumbs verticales, zoom de lupa al hover, lightbox con teclado, botón placeholder 360°.
- **Mega-menú** del header con preview de colecciones e iconos de notas.
- **2FA TOTP** completo: `lib/totp.ts`, página `/cuenta/seguridad`, server actions de enroll/confirm/disable, generación de backup codes y QR.
- **Tiptap** rich-text editor (`RichTextEditor`) con barra de herramientas dorada, link, image, headings y blockquote.
- **DataTable** compartida con tanstack-table (sort, search, pagination).
- **CRUD de productos** completo en admin con tabs General / Variantes / Imágenes / Notas / SEO, multi-idioma y validación Zod en server.
- **PDF de factura** (`lib/pdf/invoice.ts` con pdf-lib) y endpoint `/api/orders/[id]/invoice`.
- **Admin: cupones** (CRUD con generador de códigos), **reseñas** (moderación con audit log), **clientes**, **inventario** con alertas de stock crítico.
- **Pedido detalle admin** con cambio de estado, tracking + notificación email, refund Stripe.
- **Ajustes admin**: tienda, envíos (zonas), impuestos (IVA por país), apariencia (hero/CTA).
- **Cookie banner RGPD** granular y **botón flotante WhatsApp**.
- **Página /cuenta/pedidos y /cuenta/favoritos** del cliente.
- Cableado del email de confirmación al webhook de Stripe.
- Stripe webhook ahora envía `OrderConfirmation` automáticamente.

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
