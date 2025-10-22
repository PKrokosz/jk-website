import { referenceProductTemplates } from "@jk/db/seed-data";

import {
  CatalogFunnelStage,
  CatalogLeather,
  CatalogOrderReference,
  CatalogProductCategory,
  CatalogProductDetail,
  CatalogProductSummary,
  CatalogProductVariants,
  CatalogStyle
} from "./types";
import { ORDER_ACCESSORIES } from "@/config/orderAccessories";
import { ORDER_MODELS } from "@/config/orderModels";
import { ORDER_EXTRA_MAP } from "@/config/orderExtras";

const CATEGORY_LABELS: Record<CatalogProductCategory, string> = {
  footwear: "Buty",
  accessories: "Akcesoria",
  hydration: "Bukłaki",
  care: "Pielęgnacja"
};

const FUNNEL_LABELS: Record<CatalogFunnelStage, string> = {
  TOFU: "TOFU — inspiracja i rozpoznanie potrzeb",
  MOFU: "MOFU — konfiguracja i porównanie oferty",
  BOFU: "BOFU — finalizacja zamówienia w warsztacie"
};

const ORDER_MODEL_MAP = new Map(ORDER_MODELS.map((model) => [model.id, model]));
const ORDER_ACCESSORY_MAP = new Map(
  ORDER_ACCESSORIES.map((accessory) => [accessory.id, accessory])
);

const PRODUCT_GALLERY_FALLBACK = "/image/models/placeholder.svg";

type ProductTemplateRow = typeof import("@jk/db").productTemplate.$inferSelect;
type ProductTemplateSeed = (typeof referenceProductTemplates)[number];

export interface ProductTemplate {
  id: string;
  slug: string;
  name: string;
  styleId: number;
  leatherId: number;
  description: string;
  highlight: string;
  galleryImages: string[];
  galleryCaptions: string[];
  variantLeatherIds: number[];
  sizes: number[];
  craftProcess: string[];
  seo: CatalogProductDetail["seo"];
  category: CatalogProductCategory;
  funnelStage: CatalogFunnelStage;
  orderReference?: CatalogOrderReference;
  priceOverrideGrosz?: number;
}

function normalizeOrderReference(
  reference?: CatalogOrderReference | null
): CatalogOrderReference | undefined {
  if (!reference) {
    return undefined;
  }

  return mapOrderReference(reference.type, reference.id, reference.label);
}

function mapOrderReference(
  type: CatalogOrderReference["type"],
  id: string,
  fallback: string
): CatalogOrderReference {
  if (type === "model") {
    const model = ORDER_MODEL_MAP.get(id);
    return {
      type,
      id,
      label: model ? `Model ${model.name}` : fallback
    } satisfies CatalogOrderReference;
  }

  if (type === "accessory") {
    const accessory = ORDER_ACCESSORY_MAP.get(id);
    return {
      type,
      id,
      label: accessory ? `Akcesorium ${accessory.name}` : fallback
    } satisfies CatalogOrderReference;
  }

  return {
    type,
    id,
    label: fallback
  } satisfies CatalogOrderReference;
}

function mapSeedToTemplate(seed: ProductTemplateSeed): ProductTemplate {
  return {
    id: seed.templateId,
    slug: seed.slug,
    name: seed.name,
    styleId: seed.styleId,
    leatherId: seed.leatherId,
    description: seed.description,
    highlight: seed.highlight,
    galleryImages: [...seed.galleryImages],
    galleryCaptions: [...seed.galleryCaptions],
    variantLeatherIds: [...seed.variantLeatherIds],
    sizes: [...seed.sizes],
    craftProcess: [...seed.craftProcess],
    seo: {
      title: seed.seo.title,
      description: seed.seo.description,
      keywords: [...seed.seo.keywords]
    },
    category: seed.category,
    funnelStage: seed.funnelStage,
    orderReference: seed.orderReference
      ? { ...seed.orderReference }
      : undefined,
    priceOverrideGrosz: seed.priceOverrideGrosz
  } satisfies ProductTemplate;
}

function normalizeJsonArray<T>(value: unknown, transform: (entry: unknown) => T): T[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(transform);
}

export function mapProductTemplateRow(row: ProductTemplateRow): ProductTemplate {
  const galleryImages = normalizeJsonArray(row.galleryImages, (entry) => String(entry));
  const galleryCaptions = normalizeJsonArray(row.galleryCaptions, (entry) => String(entry));
  const variantLeatherIds = normalizeJsonArray(row.variantLeatherIds, (entry) => Number(entry));
  const sizes = normalizeJsonArray(row.sizes, (entry) => Number(entry));
  const craftProcess = normalizeJsonArray(row.craftProcess, (entry) => String(entry));

  const seo = row.seo ?? {};
  const keywords = normalizeJsonArray((seo as { keywords?: unknown }).keywords, (entry) =>
    String(entry)
  );

  const orderReference = row.orderReference
    ? {
        type: row.orderReference.type,
        id: row.orderReference.id,
        label: row.orderReference.label
      }
    : undefined;

  return {
    id: row.templateId,
    slug: row.slug,
    name: row.name,
    styleId: row.styleId,
    leatherId: row.leatherId,
    description: row.descriptionMd,
    highlight: row.highlight,
    galleryImages,
    galleryCaptions,
    variantLeatherIds,
    sizes,
    craftProcess,
    seo: {
      title: String((seo as { title?: unknown }).title ?? ""),
      description: String((seo as { description?: unknown }).description ?? ""),
      keywords
    },
    category: row.category as CatalogProductCategory,
    funnelStage: row.funnelStage as CatalogFunnelStage,
    orderReference,
    priceOverrideGrosz: row.priceOverrideGrosz ?? undefined
  } satisfies ProductTemplate;
}

function cloneTemplate(template: ProductTemplate): ProductTemplate {
  return {
    ...template,
    galleryImages: [...template.galleryImages],
    galleryCaptions: [...template.galleryCaptions],
    variantLeatherIds: [...template.variantLeatherIds],
    sizes: [...template.sizes],
    craftProcess: [...template.craftProcess],
    seo: {
      title: template.seo.title,
      description: template.seo.description,
      keywords: [...template.seo.keywords]
    },
    orderReference: template.orderReference
      ? { ...template.orderReference }
      : undefined
  } satisfies ProductTemplate;
}

const fallbackProductTemplates = referenceProductTemplates.map(mapSeedToTemplate);

export function getFallbackProductTemplates(): ProductTemplate[] {
  return fallbackProductTemplates.map(cloneTemplate);
}

function resolveOrderPriceGrosz(reference?: CatalogOrderReference) {
  if (!reference) {
    return undefined;
  }

  if (reference.type === "model") {
    const model = ORDER_MODEL_MAP.get(reference.id);
    if (model) {
      return Math.round(model.price * 100);
    }
  }

  if (reference.type === "accessory") {
    const accessory = ORDER_ACCESSORY_MAP.get(reference.id);
    if (accessory) {
      return Math.round(accessory.price * 100);
    }
  }

  if (reference.type === "service" && reference.id in ORDER_EXTRA_MAP) {
    const extra = ORDER_EXTRA_MAP[reference.id as keyof typeof ORDER_EXTRA_MAP];
    if (extra) {
      return Math.round(extra.price * 100);
    }
  }

  return undefined;
}

function computePrice(
  template: ProductTemplate,
  style: CatalogStyle | undefined,
  leather: CatalogLeather | undefined,
  orderReference?: CatalogOrderReference
) {
  const orderPriceGrosz = resolveOrderPriceGrosz(orderReference);
  if (typeof orderPriceGrosz === "number") {
    return Math.max(0, orderPriceGrosz);
  }

  if (typeof template.priceOverrideGrosz === "number") {
    return Math.max(0, template.priceOverrideGrosz);
  }

  const basePrice = style?.basePriceGrosz ?? 0;
  const leatherMod = leather?.priceModGrosz ?? 0;
  return Math.max(0, basePrice + leatherMod);
}

function buildProductGallery(
  template: ProductTemplate
): CatalogProductDetail["gallery"] {
  if (template.galleryImages.length > 0) {
    const assets = template.galleryImages;
    return template.galleryCaptions.map((caption, index) => {
      const src =
        assets[index] ??
        assets[assets.length - 1] ??
        PRODUCT_GALLERY_FALLBACK;
      return createGalleryImage(template.name, caption, src);
    });
  }

  return template.galleryCaptions.map((caption) =>
    createPlaceholderImage(template.name, caption)
  );
}

function createGalleryImage(name: string, caption: string, src: string) {
  const normalizedCaption = caption.charAt(0).toUpperCase() + caption.slice(1);

  return {
    alt: `Model ${name} — ${normalizedCaption}`,
    src
  } satisfies CatalogProductDetail["gallery"][number];
}

function createPlaceholderImage(name: string, caption: string) {
  const normalizedCaption = caption.charAt(0).toUpperCase() + caption.slice(1);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400' role='img'><rect width='600' height='400' rx='24' fill='%23171829'/><text x='50%' y='45%' dominant-baseline='middle' text-anchor='middle' fill='%23f7f2e8' font-family='serif' font-size='32'>${name}</text><text x='50%' y='65%' dominant-baseline='middle' text-anchor='middle' fill='%23c9b37c' font-family='serif' font-size='20'>${normalizedCaption}</text></svg>`;

  return {
    alt: `Model ${name} — ${normalizedCaption} (placeholder)`,
    src: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
  } satisfies CatalogProductDetail["gallery"][number];
}

function buildVariants(
  template: ProductTemplate,
  leathers: Map<number, CatalogLeather>
): CatalogProductVariants {
  const uniqueLeatherIds = Array.from(new Set(template.variantLeatherIds));

  const colors = uniqueLeatherIds.map((id, index) => {
    const leather = leathers.get(id);
    const resolvedId = leather?.id ?? id;
    return {
      id: `${template.id}-color-${resolvedId ?? index}`,
      leatherId: resolvedId,
      name: leather?.name ?? "Nieznana skóra"
    };
  });

  return {
    colors,
    sizes: [...template.sizes]
  } satisfies CatalogProductVariants;
}

export function listProductSlugs() {
  return fallbackProductTemplates.map((template) => template.slug);
}

export function createProductsFromTemplates(
  templates: ProductTemplate[],
  styles: CatalogStyle[],
  leathers: CatalogLeather[]
): CatalogProductSummary[] {
  const styleById = new Map(styles.map((style) => [style.id, style]));
  const leatherById = new Map(leathers.map((leather) => [leather.id, leather]));

  return templates.map((template, index) => {
    const style = styleById.get(template.styleId) ?? styles[index % styles.length];
    const leather =
      leatherById.get(template.leatherId) ??
      leathers[index % leathers.length];
    const orderReference = normalizeOrderReference(template.orderReference);
    const priceGrosz = computePrice(template, style, leather, orderReference);
    const categoryLabel = CATEGORY_LABELS[template.category] ?? template.category;
    const funnelLabel = FUNNEL_LABELS[template.funnelStage] ?? template.funnelStage;

    return {
      id: template.id,
      slug: template.slug,
      name: template.name,
      styleId: style?.id ?? template.styleId,
      leatherId: leather?.id ?? template.leatherId,
      description: template.description,
      highlight: template.highlight,
      priceGrosz,
      category: template.category,
      categoryLabel,
      funnelStage: template.funnelStage,
      funnelLabel,
      orderReference
    } satisfies CatalogProductSummary;
  });
}

export function createMockProducts(
  styles: CatalogStyle[],
  leathers: CatalogLeather[]
): CatalogProductSummary[] {
  return createProductsFromTemplates(
    getFallbackProductTemplates(),
    styles,
    leathers
  );
}

export function createProductDetailFromTemplate(
  template: ProductTemplate,
  styles: CatalogStyle[],
  leathers: CatalogLeather[]
): CatalogProductDetail {
  const styleById = new Map(styles.map((style) => [style.id, style]));
  const leatherById = new Map(leathers.map((leather) => [leather.id, leather]));
  const style = styleById.get(template.styleId);
  const leather = leatherById.get(template.leatherId);

  const orderReference = normalizeOrderReference(template.orderReference);
  const gallery = buildProductGallery(template);

  return {
    id: template.id,
    slug: template.slug,
    name: template.name,
    styleId: style?.id ?? template.styleId,
    leatherId: leather?.id ?? template.leatherId,
    description: template.description,
    highlight: template.highlight,
    priceGrosz: computePrice(template, style, leather, orderReference),
    gallery,
    variants: buildVariants(template, leatherById),
    craftProcess: [...template.craftProcess],
    seo: {
      title: template.seo.title,
      description: template.seo.description,
      keywords: [...template.seo.keywords]
    },
    category: template.category,
    categoryLabel: CATEGORY_LABELS[template.category] ?? template.category,
    funnelStage: template.funnelStage,
    funnelLabel: FUNNEL_LABELS[template.funnelStage] ?? template.funnelStage,
    orderReference
  } satisfies CatalogProductDetail;
}

export function getProductFromTemplates(
  templates: ProductTemplate[],
  slug: string,
  styles: CatalogStyle[],
  leathers: CatalogLeather[]
): CatalogProductDetail | undefined {
  const template = templates.find((item) => item.slug === slug);
  if (!template) {
    return undefined;
  }

  return createProductDetailFromTemplate(template, styles, leathers);
}

export function getProductBySlug(
  slug: string,
  styles: CatalogStyle[],
  leathers: CatalogLeather[]
): CatalogProductDetail | undefined {
  return getProductFromTemplates(
    getFallbackProductTemplates(),
    slug,
    styles,
    leathers
  );
}
