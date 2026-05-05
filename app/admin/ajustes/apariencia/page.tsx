import { prisma } from "@/lib/prisma";
import { AppearanceForm } from "./AppearanceForm";

export const dynamic = "force-dynamic";

export default async function AppearanceSettingsPage() {
  const settings = await prisma.setting.findMany({
    where: { key: { in: ["hero.video", "hero.image", "hero.cta", "hero.copy"] } },
  });
  const map: Record<string, unknown> = {};
  for (const s of settings) map[s.key] = s.value;

  return (
    <AppearanceForm
      initial={{
        videoUrl: typeof map["hero.video"] === "string" ? (map["hero.video"] as string) : "",
        imageUrl: typeof map["hero.image"] === "string" ? (map["hero.image"] as string) : "",
        ctaLabel:
          typeof map["hero.cta"] === "object" && map["hero.cta"]
            ? (map["hero.cta"] as { label?: string }).label ?? ""
            : "",
        ctaUrl:
          typeof map["hero.cta"] === "object" && map["hero.cta"]
            ? (map["hero.cta"] as { url?: string }).url ?? ""
            : "",
        copy: typeof map["hero.copy"] === "string" ? (map["hero.copy"] as string) : "",
      }}
    />
  );
}
