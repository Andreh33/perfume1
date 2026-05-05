import { LegalLayout } from "@/components/marketing/LegalLayout";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Términos y condiciones", path: "/terminos" });

export default function TermsPage() {
  return (
    <LegalLayout title="Términos y condiciones">
      <p>
        Estos términos rigen la relación entre Sol Perfumes Árabes S.L. y los clientes que realizan
        compras a través de este sitio.
      </p>
      <h2>1. Información de los productos</h2>
      <p>
        Cada perfume se describe con la mayor exactitud posible. Las imágenes son orientativas; el
        producto final puede presentar diferencias menores propias de procesos artesanales.
      </p>
      <h2>2. Precios e impuestos</h2>
      <p>
        Los precios mostrados incluyen IVA español (21 %). En envíos a otros países UE se aplicará el
        IVA correspondiente. Los gastos de envío se calculan en el checkout.
      </p>
      <h2>3. Formalización del pedido y pago</h2>
      <p>
        El pedido se formaliza al confirmar el pago. Aceptamos tarjeta (Visa, Mastercard, AmEx),
        Apple Pay, Google Pay y Bizum (cuando esté disponible) a través de Stripe.
      </p>
      <h2>4. Envíos</h2>
      <p>
        Enviamos en 24–72 h laborables a España peninsular y 3–7 días al resto de la UE. Los plazos
        son orientativos. Detalles en <a href="/envios-y-devoluciones">Envíos y devoluciones</a>.
      </p>
      <h2>5. Desistimiento</h2>
      <p>
        Tienes 14 días naturales desde la entrega para desistir, salvo en productos con sello de
        seguridad roto, por motivos higiénicos.
      </p>
      <h2>6. Ley aplicable</h2>
      <p>Legislación española. Para conflictos: tribunales de Madrid.</p>
    </LegalLayout>
  );
}
