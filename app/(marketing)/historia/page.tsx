import { SectionHeader } from "@/components/marketing/SectionHeader";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Nuestra historia",
  description: "De los zocos de Dubái a las calles de Madrid: la historia detrás de Sol Perfumes Árabes.",
  path: "/historia",
});

export default function StoryPage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 md:px-12 py-16">
      <SectionHeader kicker="Nuestra historia" title="De los zocos al atelier" />

      <div className="space-y-12 text-lg leading-relaxed text-[var(--color-ink-muted)]">
        <p className="display-italic text-2xl text-[var(--color-ink)] text-center">
          «Un perfume es un acto de hospitalidad: ofreces un fragmento de tu alma a quien se acerca».
        </p>

        <section className="space-y-4">
          <h2 className="display text-3xl text-[var(--color-ink)]">El origen</h2>
          <p>
            Sol Perfumes Árabes nació en 2019, en el cruce entre Madrid y Dubái, de la mano de dos mujeres
            que crecieron entre dos culturas. Yasmine, perfumista nacida en Damasco, y Carmen, andaluza con
            más de quince años en perfumería de nicho. Las dos compartían una misma frustración: en Europa
            era casi imposible acceder a la perfumería árabe auténtica.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="display text-3xl text-[var(--color-ink)]">El método</h2>
          <p>
            Cada fragancia se selecciona en visitas físicas a los talleres de Dubái, Mascate, Damasco o
            Marrakech. No trabajamos con intermediarios. El oud que vendemos es oud. La rosa de Taif que
            etiquetamos viene de Taif. El bakhoor está hecho a mano por familias que llevan generaciones
            haciéndolo.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="display text-3xl text-[var(--color-ink)]">El compromiso</h2>
          <p>
            Trabajamos con productores que respetan los ritmos de la naturaleza y los derechos de quienes
            cosechan. Nuestros frascos son rellenables. El embalaje es 100 % reciclable. La huella de
            carbono de cada pedido se compensa con un proyecto de reforestación en Marruecos.
          </p>
        </section>
      </div>
    </div>
  );
}
