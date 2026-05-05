import { LegalLayout } from "@/components/marketing/LegalLayout";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Aviso legal", path: "/aviso-legal" });

export default function ImprintPage() {
  return (
    <LegalLayout title="Aviso legal">
      <p>
        En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la Información y de
        Comercio Electrónico (LSSI-CE), se informa de los datos identificativos del titular de este
        sitio web:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Titular: Sol Perfumes Árabes S.L.</li>
        <li>CIF: B12345678</li>
        <li>Domicilio social: Calle Serrano 12, 28001 Madrid</li>
        <li>Inscrita en el Registro Mercantil de Madrid, tomo X, folio Y, hoja M-Z.</li>
        <li>Email: <a href="mailto:legal@solperfumesarabes.com">legal@solperfumesarabes.com</a></li>
      </ul>
      <h2>Propiedad intelectual</h2>
      <p>
        Todos los contenidos del sitio (textos, fotografías, logotipos, marcas) son titularidad de
        Sol Perfumes Árabes S.L. o de sus colaboradores con licencia. Queda prohibida su
        reproducción sin autorización expresa.
      </p>
    </LegalLayout>
  );
}
