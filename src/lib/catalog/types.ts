export interface CatalogStyle {
  id: number;
  slug: string;
  name: string;
  era?: string;
  description: string;
  basePriceGrosz: number;
}

export interface CatalogLeather {
  id: number;
  name: string;
  color: string;
  finish?: string;
  priceModGrosz: number;
  description: string;
}

export interface CatalogProduct {
  id: string;
  name: string;
  styleId: number;
  leatherId: number;
  description: string;
  highlight: string;
  priceGrosz: number;
}
