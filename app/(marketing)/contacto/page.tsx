import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { SectionHeader } from "@/components/marketing/SectionHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contacto",
  description: "¿Una consulta, una colaboración o una recomendación olfativa? Hablemos.",
  path: "/contacto",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 md:px-12 py-16">
      <SectionHeader
        kicker="Contacto"
        title="Hablemos de aromas"
        subtitle="Te responderemos en menos de 24 horas en días laborables."
      />

      <div className="grid lg:grid-cols-[1fr_360px] gap-10">
        <form action="/api/contact" method="post" className="card-velvet p-8 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <label className="space-y-1.5">
              <span className="accent text-[0.65rem] text-[var(--color-gold)]">Nombre</span>
              <Input name="name" required />
            </label>
            <label className="space-y-1.5">
              <span className="accent text-[0.65rem] text-[var(--color-gold)]">Email</span>
              <Input name="email" type="email" required />
            </label>
          </div>
          <label className="space-y-1.5 block">
            <span className="accent text-[0.65rem] text-[var(--color-gold)]">Asunto</span>
            <Input name="subject" required />
          </label>
          <label className="space-y-1.5 block">
            <span className="accent text-[0.65rem] text-[var(--color-gold)]">Mensaje</span>
            <textarea name="message" rows={6} required className="field" />
          </label>
          <label className="flex items-start gap-2 text-xs text-[var(--color-ink-subtle)]">
            <input type="checkbox" required className="mt-0.5 accent-[var(--color-gold)]" />
            <span>He leído y acepto la política de privacidad.</span>
          </label>
          <Button type="submit">Enviar mensaje</Button>
        </form>

        <aside className="card-velvet p-8 space-y-5 text-sm">
          <div>
            <p className="accent text-[0.65rem] text-[var(--color-gold)] mb-1">Email</p>
            <a href="mailto:hola@solperfumesarabes.com" className="hover:text-[var(--color-gold)]">
              <Mail className="inline h-4 w-4 mr-2" />
              hola@solperfumesarabes.com
            </a>
          </div>
          <div>
            <p className="accent text-[0.65rem] text-[var(--color-gold)] mb-1">WhatsApp</p>
            <a href="https://wa.me/34600000000" className="hover:text-[var(--color-gold)]">
              <Phone className="inline h-4 w-4 mr-2" />
              +34 600 000 000
            </a>
          </div>
          <div>
            <p className="accent text-[0.65rem] text-[var(--color-gold)] mb-1">Atelier</p>
            <p>
              <MapPin className="inline h-4 w-4 mr-2" />
              Calle Serrano 12, 28001 Madrid
            </p>
          </div>
          <div>
            <p className="accent text-[0.65rem] text-[var(--color-gold)] mb-1">Horario</p>
            <p>
              <Clock className="inline h-4 w-4 mr-2" />
              Lun–Vie: 10:00 – 20:00 · Sáb: 11:00 – 14:00
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
