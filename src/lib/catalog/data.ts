import { referenceLeathers, referenceStyles } from "@jk/db/seed-data";

import { CatalogLeather, CatalogStyle } from "./types";

export const catalogStyles: CatalogStyle[] = referenceStyles.map((style, index) => ({
  id: style.id ?? index + 1,
  slug: style.slug,
  name: style.name,
  era: style.era,
  description: style.description,
  basePriceGrosz: style.basePriceGrosz
}));

export const catalogLeathers: CatalogLeather[] = referenceLeathers.map((leather, index) => ({
  id: leather.id ?? index + 1,
  name: leather.name,
  color: leather.color,
  finish: leather.finish,
  priceModGrosz: leather.priceModGrosz,
  description: leather.description
}));
