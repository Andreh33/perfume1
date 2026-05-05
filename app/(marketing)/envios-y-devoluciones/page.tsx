import { LegalLayout } from "@/components/marketing/LegalLayout";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Envíos y devoluciones", path: "/envios-y-devoluciones" });

export default function ShippingPage() {
  return (
    <LegalLayout title="Envíos y devoluciones">
      <h2>Plazos y costes</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>España peninsular: 24–48 h laborables · 5,90 € · gratis a partir de 80 €.</li>
        <li>Baleares: 48–72 h · 9,90 €.</li>
        <li>Canarias, Ceuta y Melilla: 5–7 días · 14,90 € (sin IVA, gestiones aduaneras).</li>
        <li>UE: 3–7 días · desde 9,90 €.</li>
        <li>Internacional: 7–14 días · desde 19,90 €.</li>
      </ul>
      <h2>Empaquetado</h2>
      <p>
        Cada pedido se prepara a mano con embalaje 100 % reciclable, lazo dorado y muestra de
        regalo (en pedidos &gt; 120 €). Te enviamos número de seguimiento por email.
      </p>
      <h2>Devoluciones</h2>
      <p>
        Tienes 14 días naturales desde la entrega para desistir. El producto debe regresar sin abrir
        y con su sello de seguridad intacto. Reembolsamos en menos de 7 días tras recibir la
        devolución por el método de pago original.
      </p>
      <h2>Pedido defectuoso</h2>
      <p>
        Si tu pedido llega dañado, escríbenos en menos de 48 h con fotografías a{" "}
        <a href="mailto:hola@solperfumesarabes.com">hola@solperfumesarabes.com</a> y te enviaremos un
        reemplazo de inmediato.
      </p>
    </LegalLayout>
  );
}
