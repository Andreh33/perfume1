import { prisma } from "@/lib/prisma";
import { StoreSettingsForm } from "./StoreSettingsForm";

export const dynamic = "force-dynamic";

type SettingValue = {
  "store.name"?: string;
  "store.tagline"?: { es: string; en: string; ar: string };
  "store.currency"?: string;
  "store.country"?: string;
  "topbar.enabled"?: boolean;
  "topbar.message"?: { es: string; en: string; ar: string };
};

export default async function StoreSettingsPage() {
  const settings = await prisma.setting.findMany({
    where: {
      key: { in: ["store.name", "store.tagline", "store.currency", "store.country", "topbar.enabled", "topbar.message"] },
    },
  });
  const map = settings.reduce<SettingValue>((acc, s) => {
    (acc as Record<string, unknown>)[s.key] = s.value;
    return acc;
  }, {});

  return <StoreSettingsForm initial={map} />;
}
