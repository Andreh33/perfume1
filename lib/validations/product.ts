import { z } from "zod";

const i18nSchema = z.object({
  es: z.string().min(1),
  en: z.string().min(1),
  ar: z.string().min(1),
});

export const variantSchema = z.object({
  id: z.string().optional(),
  sizeMl: z.number().int().positive(),
  sku: z.string().min(2).max(64),
  priceCents: z.number().int().nonnegative(),
  compareAtCents: z.number().int().nonnegative().nullable().optional(),
  weightGrams: z.number().int().positive().default(150),
  stock: z.number().int().nonnegative().default(0),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const productImageSchema = z.object({
  id: z.string().optional(),
  url: z.string().url(),
  alt: i18nSchema,
  blurDataUrl: z.string().optional(),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
  position: z.number().int().nonnegative(),
  isCover: z.boolean().default(false),
});

export const productNoteInputSchema = z.object({
  noteId: z.string().cuid(),
  type: z.enum(["SALIDA", "CORAZON", "FONDO"]),
  position: z.number().int().nonnegative().default(0),
});

export const productSchema = z.object({
  slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/),
  name: i18nSchema,
  shortDescription: i18nSchema.optional(),
  description: z.unknown().optional(),
  story: z.unknown().optional(),
  howToUse: z.unknown().optional(),
  gender: z.enum(["MASCULINO", "FEMENINO", "UNISEX"]),
  family: z.string().min(1),
  perfumer: z.string().optional(),
  origin: z.string().optional(),
  releaseYear: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isLimited: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  metaTitle: i18nSchema.optional(),
  metaDescription: i18nSchema.optional(),
  ogImage: z.string().url().optional(),
  collectionId: z.string().cuid().optional(),
  variants: z.array(variantSchema).min(1),
  images: z.array(productImageSchema),
  notes: z.array(productNoteInputSchema),
});

export type ProductInput = z.infer<typeof productSchema>;
