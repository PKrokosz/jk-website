import React from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const notFoundMock = vi.hoisted(() =>
  vi.fn(() => {
    throw new Error("NOT_FOUND");
  })
);

vi.mock("next/navigation", () => ({
  __esModule: true,
  notFound: notFoundMock
}));

import ProductPage, { generateMetadata, generateStaticParams } from "../[slug]/page";
import { CatalogApiError } from "@/lib/catalog/api";
import type { CatalogProductSummary } from "@/lib/catalog/types";

const sampleStyles = [
  { id: 1, slug: "style-1", name: "Szermierz", era: "XIV", description: "Opis", basePriceGrosz: 80_000 }
];
const sampleLeathers = [
  { id: 2, name: "Ciemny brąz", color: "Brąz", priceModGrosz: 20_000, description: "Skóra" }
];

const sampleProduct = {
  id: "produkt-1",
  slug: "produkt-1",
  name: "Model testowy",
  styleId: sampleStyles[0].id,
  leatherId: sampleLeathers[0].id,
  description: "Opis produktu",
  highlight: "Wyróżnik",
  priceGrosz: 120_000,
  category: "footwear" as const,
  categoryLabel: "Buty",
  funnelStage: "MOFU" as const,
  funnelLabel: "MOFU — konfiguracja i porównanie oferty",
  orderReference: undefined,
  gallery: [{ src: "/image/test.jpg", alt: "Test" }],
  variants: { colors: [{ id: "color-1", leatherId: sampleLeathers[0].id, name: "Ciemny brąz" }], sizes: [42, 43] },
  craftProcess: ["Krok 1", "Krok 2"],
  seo: { title: "SEO", description: "SEO opis", keywords: ["buty"] }
};

const fallbackSlugs = [sampleProduct.slug];

const fetchStylesMock = vi.hoisted(() => vi.fn(async () => sampleStyles));
const fetchLeathersMock = vi.hoisted(() => vi.fn(async () => sampleLeathers));
const fetchProductsMock = vi.hoisted(() =>
  vi.fn(async (): Promise<CatalogProductSummary[]> => [])
);
const fetchProductDetailMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/catalog/api", () => ({
  __esModule: true,
  CatalogApiError: class MockCatalogApiError extends Error {
    constructor(public status: number, public path: string, message: string) {
      super(message);
      this.name = "CatalogApiError";
    }
  },
  fetchCatalogStyles: fetchStylesMock,
  fetchCatalogLeathers: fetchLeathersMock,
  fetchCatalogProducts: fetchProductsMock,
  fetchCatalogProductDetail: fetchProductDetailMock
}));

vi.mock("@/lib/catalog/products", () => ({
  __esModule: true,
  listProductSlugs: () => fallbackSlugs
}));

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, prefetch: _prefetch, ...rest }: any) => (
    <a href={typeof href === "string" ? href : "#"} {...rest}>
      {children}
    </a>
  )
}));

vi.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...rest }: any) => {
    const { fill: _fill, ...imgProps } = rest;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={typeof src === "string" ? src : ""} alt={alt ?? ""} {...imgProps} />
    );
  }
}));

describe("Product page metadata", () => {
  afterEach(() => {
    notFoundMock.mockClear();
    fetchStylesMock.mockClear();
    fetchLeathersMock.mockClear();
    fetchProductsMock.mockClear();
    fetchProductDetailMock.mockClear();
  });

  it("zwraca metadane dla istniejącego produktu", async () => {
    const slug = sampleProduct.slug;
    fetchProductDetailMock.mockResolvedValue(sampleProduct);

    const metadata = await generateMetadata({ params: { slug } });

    expect(metadata).toMatchObject({
      title: sampleProduct.seo.title,
      description: sampleProduct.seo.description,
      keywords: sampleProduct.seo.keywords
    });
  });

  it("zwraca fallbackowe metadane dla nieistniejącego produktu", async () => {
    fetchProductDetailMock.mockRejectedValue(new CatalogApiError(404, "/api/products/nie-istnieje", "not found"));

    const metadata = await generateMetadata({ params: { slug: "nie-istnieje" } });

    expect(metadata).toMatchObject({
      title: "Model niedostępny",
      description: expect.stringContaining("nie istnieje")
    });
  });

  it("generuje statyczne parametry dla wszystkich slugów", async () => {
    const slugs = [sampleProduct.slug];
    fetchProductsMock.mockResolvedValue(
      slugs.map<CatalogProductSummary>((slug) => ({
        id: slug,
        slug,
        name: sampleProduct.name,
        styleId: 1,
        leatherId: 1,
        description: sampleProduct.description,
        highlight: sampleProduct.highlight,
        priceGrosz: sampleProduct.priceGrosz,
        category: "footwear" as const,
        categoryLabel: sampleProduct.categoryLabel,
        funnelStage: "MOFU" as const,
        funnelLabel: sampleProduct.funnelLabel,
        orderReference: undefined
      }))
    );
    const params = await generateStaticParams();

    slugs.forEach((slug) => {
      expect(params).toContainEqual({ slug });
    });
  });
});

describe("ProductPage", () => {
  beforeEach(() => {
    notFoundMock.mockClear();
    fetchStylesMock.mockClear();
    fetchLeathersMock.mockClear();
    fetchProductsMock.mockClear();
    fetchProductDetailMock.mockClear();
  });

  afterEach(() => {
    notFoundMock.mockClear();
    fetchStylesMock.mockClear();
    fetchLeathersMock.mockClear();
    fetchProductsMock.mockClear();
    fetchProductDetailMock.mockClear();
  });

  it("renderuje kluczowe informacje o produkcie", async () => {
    const slug = sampleProduct.slug;

    fetchProductDetailMock.mockResolvedValue(sampleProduct);

    render(await ProductPage({ params: { slug } }));

    expect(screen.getByRole("heading", { level: 1, name: sampleProduct.name })).toBeInTheDocument();
    expect(screen.getByText(sampleProduct.description)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Catalog" })).toHaveAttribute("href", "/catalog");
    expect(screen.getByRole("link", { name: "Skontaktuj się z nami" })).toHaveAttribute(
      "href",
      `/contact?product=${sampleProduct.slug}`
    );
    expect(screen.getAllByRole("list")).not.toHaveLength(0);
  });

  it("używa notFound dla nieistniejącego sluga", async () => {
    fetchProductDetailMock.mockRejectedValue(
      new CatalogApiError(404, "/api/products/brak-produktu", "not found")
    );

    await expect(ProductPage({ params: { slug: "brak-produktu" } })).rejects.toThrow("NOT_FOUND");
    expect(notFoundMock).toHaveBeenCalled();
  });
});
