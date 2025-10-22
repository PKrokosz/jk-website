import { z } from "zod";

export const catalogOrderReferenceSchema = z.object({
  type: z.enum(["model", "accessory", "service"]),
  id: z.string(),
  label: z.string()
});

export const catalogProductSummarySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  styleId: z.number().int(),
  leatherId: z.number().int(),
  description: z.string(),
  highlight: z.string(),
  priceGrosz: z.number().int(),
  category: z.enum(["footwear", "accessories", "hydration", "care"]),
  categoryLabel: z.string(),
  funnelStage: z.enum(["TOFU", "MOFU", "BOFU"]),
  funnelLabel: z.string(),
  orderReference: catalogOrderReferenceSchema.optional()
});

export const catalogProductImageSchema = z.object({
  src: z.string(),
  alt: z.string()
});

export const catalogProductVariantsSchema = z.object({
  colors: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      leatherId: z.number().int()
    })
  ),
  sizes: z.array(z.number().int())
});

export const catalogProductDetailSchema = catalogProductSummarySchema.extend({
  gallery: z.array(catalogProductImageSchema),
  variants: catalogProductVariantsSchema,
  craftProcess: z.array(z.string()),
  seo: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string())
  })
});

export const catalogProductListResponseSchema = z.object({
  data: z.array(catalogProductSummarySchema)
});

export const catalogProductDetailResponseSchema = z.object({
  data: catalogProductDetailSchema
});
