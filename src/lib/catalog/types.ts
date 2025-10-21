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

export interface CatalogProductSummary {
  id: string;
  slug: string;
  name: string;
  styleId: number;
  leatherId: number;
  description: string;
  highlight: string;
  priceGrosz: number;
}

export interface CatalogProductImage {
  src: string;
  alt: string;
}

export interface CatalogProductVariants {
  colors: Array<{
    id: string;
    name: string;
    leatherId: number;
  }>;
  sizes: number[];
}

export interface CatalogProductDetail extends CatalogProductSummary {
  gallery: CatalogProductImage[];
  variants: CatalogProductVariants;
  craftProcess: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}
