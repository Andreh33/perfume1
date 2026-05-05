import { LegalLayout } from "@/components/marketing/LegalLayout";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Política de privacidad", path: "/politica-privacidad" });

export default function PrivacyPage() {
  return (
    <LegalLayout title="Política de privacidad">
      <p>
        En Sol Perfumes Árabes (en adelante, «la Tienda») cuidamos los datos personales de quienes
        nos visitan, compran o se suscriben a nuestras comunicaciones. Esta política explica qué
        datos recogemos, con qué finalidad, durante cuánto tiempo y cuáles son tus derechos.
      </p>
      <h2>1. Responsable del tratamiento</h2>
      <p>
        Sol Perfumes Árabes S.L., con CIF B12345678 y domicilio en Calle Serrano 12, 28001 Madrid.
        Email de contacto: <a href="mailto:rgpd@solperfumesarabes.com">rgpd@solperfumesarabes.com</a>.
      </p>
      <h2>2. Datos que tratamos</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Identificativos y de contacto (nombre, dirección, email, teléfono).</li>
        <li>Datos de pago tokenizados por Stripe (no almacenamos tarjetas).</li>
        <li>Histórico de pedidos y preferencias olfativas para recomendaciones.</li>
        <li>Datos de navegación a través de cookies (ver política de cookies).</li>
      </ul>
      <h2>3. Finalidades</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Tramitación y entrega de pedidos.</li>
        <li>Atención al cliente.</li>
        <li>Envío de comunicaciones comerciales (siempre con consentimiento explícito).</li>
        <li>Cumplimiento de obligaciones legales (fiscales, contables).</li>
      </ul>
      <h2>4. Conservación</h2>
      <p>
        Los datos vinculados a pedidos se conservan durante el plazo legal exigido (6 años, AEAT).
        Los datos de marketing, hasta que retires el consentimiento.
      </p>
      <h2>5. Tus derechos</h2>
      <p>
        Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, supresión,
        oposición, limitación y portabilidad escribiendo a{" "}
        <a href="mailto:rgpd@solperfumesarabes.com">rgpd@solperfumesarabes.com</a>. También puedes
        presentar reclamación ante la AEPD.
      </p>
    </LegalLayout>
  );
}
