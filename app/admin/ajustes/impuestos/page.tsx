import { prisma } from "@/lib/prisma";
import { TaxForm } from "./TaxForm";

export const dynamic = "force-dynamic";

export default async function TaxSettingsPage() {
  const setting = await prisma.setting.findUnique({ where: { key: "tax.rates" } });
  const rates = (setting?.value as Array<{ country: string; label: string; rate: number }>) ?? [
    { country: "ES", label: "España (IVA general)", rate: 0.21 },
    { country: "FR", label: "Francia (TVA)", rate: 0.20 },
    { country: "IT", label: "Italia (IVA)", rate: 0.22 },
    { country: "PT", label: "Portugal (IVA)", rate: 0.23 },
    { country: "DE", label: "Alemania (USt)", rate: 0.19 },
  ];

  return <TaxForm initialRates={rates} />;
}
