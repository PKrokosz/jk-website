import type { CatalogLeather, CatalogStyle } from "./types";

type DbModule = typeof import("@jk/db");
type StyleRow = DbModule["style"]["$inferSelect"];
type LeatherRow = DbModule["leather"]["$inferSelect"];

export function mapStyleRowToCatalogStyle(row: StyleRow): CatalogStyle {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    era: row.era ?? undefined,
    description: row.descriptionMd ?? "",
    basePriceGrosz: row.basePriceGrosz
  } satisfies CatalogStyle;
}

export function mapLeatherRowToCatalogLeather(row: LeatherRow): CatalogLeather {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    finish: row.finish ?? undefined,
    priceModGrosz: row.priceModGrosz ?? 0,
    description: row.description ?? ""
  } satisfies CatalogLeather;
}
