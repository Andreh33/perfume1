import { prisma } from "@/lib/prisma";
import { ShippingForm } from "./ShippingForm";

export const dynamic = "force-dynamic";

export default async function ShippingSettingsPage() {
  const settings = await prisma.setting.findMany({
    where: { key: { in: ["shipping.standardCents", "shipping.freeThresholdCents", "shipping.zones"] } },
  });
  const map: Record<string, unknown> = {};
  for (const s of settings) map[s.key] = s.value;

  return (
    <ShippingForm
      initial={{
        standardCents: typeof map["shipping.standardCents"] === "number" ? (map["shipping.standardCents"] as number) : 590,
        freeThresholdCents:
          typeof map["shipping.freeThresholdCents"] === "number" ? (map["shipping.freeThresholdCents"] as number) : 8000,
        zones: Array.isArray(map["shipping.zones"]) ? (map["shipping.zones"] as Zone[]) : defaultZones,
      }}
    />
  );
}

type Zone = { name: string; countries: string[]; ratesCents: number; etaDays: string };

const defaultZones: Zone[] = [
  { name: "España peninsular", countries: ["ES"], ratesCents: 590, etaDays: "1-2 días" },
  { name: "UE", countries: ["FR", "IT", "PT", "DE", "BE", "NL"], ratesCents: 990, etaDays: "3-7 días" },
  { name: "Internacional", countries: ["GB", "US", "AE"], ratesCents: 1990, etaDays: "7-14 días" },
];
