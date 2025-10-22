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
import { catalogLeathers, catalogStyles } from "@/lib/catalog/data";
import { getProductBySlug, listProductSlugs } from "@/lib/catalog/products";

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
  });

  it("zwraca metadane dla istniejącego produktu", async () => {
    const slug = listProductSlugs()[0];
    const product = getProductBySlug(slug, catalogStyles, catalogLeathers);

    const metadata = await generateMetadata({ params: { slug } });

    expect(product).toBeTruthy();
    expect(metadata).toMatchObject({
      title: product?.seo.title,
      description: product?.seo.description,
      keywords: product?.seo.keywords
    });
  });

  it("zwraca fallbackowe metadane dla nieistniejącego produktu", async () => {
    const metadata = await generateMetadata({ params: { slug: "nie-istnieje" } });

    expect(metadata).toMatchObject({
      title: "Model niedostępny",
      description: expect.stringContaining("nie istnieje")
    });
  });

  it("generuje statyczne parametry dla wszystkich slugów", () => {
    const slugs = listProductSlugs();
    const params = generateStaticParams();

    slugs.forEach((slug) => {
      expect(params).toContainEqual({ slug });
    });
  });
});

describe("ProductPage", () => {
  beforeEach(() => {
    notFoundMock.mockClear();
  });

  afterEach(() => {
    notFoundMock.mockClear();
  });

  it("renderuje kluczowe informacje o produkcie", () => {
    const slug = listProductSlugs()[0];
    const product = getProductBySlug(slug, catalogStyles, catalogLeathers);

    expect(product).toBeTruthy();

    render(<ProductPage params={{ slug }} />);

    expect(screen.getByRole("heading", { level: 1, name: product!.name })).toBeInTheDocument();
    expect(screen.getByText(product!.description)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Catalog" })).toHaveAttribute("href", "/catalog");
    expect(screen.getByRole("link", { name: "Skontaktuj się z nami" })).toHaveAttribute(
      "href",
      `/contact?product=${product!.slug}`
    );
    expect(screen.getAllByRole("list")).not.toHaveLength(0);
  });

  it("używa notFound dla nieistniejącego sluga", () => {
    expect(() => render(<ProductPage params={{ slug: "brak-produktu" }} />)).toThrow("NOT_FOUND");
    expect(notFoundMock).toHaveBeenCalled();
  });
});
