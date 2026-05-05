import { z } from "zod";

const i18nSchema = z.object({
  es: z.string().min(1),
  en: z.string().min(1),
  ar: z.string().min(1),
});

export const fairSchema = z
  .object({
    slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/),
    title: i18nSchema,
    description: i18nSchema.optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    timezone: z.string().default("Europe/Madrid"),
    allDay: z.boolean().default(false),
    city: z.string().min(1),
    country: z.string().length(2),
    venue: z.string().optional(),
    address: z.string().optional(),
    lat: z.number().min(-90).max(90).optional(),
    lng: z.number().min(-180).max(180).optional(),
    websiteUrl: z.string().url().optional(),
    ticketUrl: z.string().url().optional(),
    coverImage: z.string().url().optional(),
    gallery: z.array(z.string().url()).default([]),
    status: z.enum(["UPCOMING", "ONGOING", "PAST", "CANCELLED"]).default("UPCOMING"),
    statusManual: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  })
  .refine((d) => d.endDate >= d.startDate, {
    message: "endDate debe ser posterior o igual a startDate",
    path: ["endDate"],
  });

export type FairInput = z.infer<typeof fairSchema>;
