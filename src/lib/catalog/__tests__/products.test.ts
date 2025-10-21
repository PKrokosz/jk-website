import { describe, expect, it } from "vitest";

import { catalogLeathers, catalogStyles } from "@/lib/catalog/data";
import { createMockProducts, getProductBySlug, listProductSlugs } from "@/lib/catalog/products";

describe("catalog products helpers", () => {
  it("creates product summaries with slugs", () => {
    const products = createMockProducts(catalogStyles, catalogLeathers);

    expect(products).toHaveLength(8);
    expect(products[0]).toMatchObject({
      slug: expect.stringContaining("regal-huntsman"),
      priceGrosz: expect.any(Number)
    });
  });

  it("returns detailed product data by slug", () => {
    const detail = getProductBySlug("amber-guild-oxfords", catalogStyles, catalogLeathers);

    expect(detail?.gallery).toHaveLength(3);
    expect(detail?.variants.colors.length).toBeGreaterThan(0);
    expect(detail?.seo.title).toContain("Amber Guild Oxfords");
  });

  it("lists all product slugs", () => {
    const slugs = listProductSlugs();

    expect(slugs).toContain("midnight-guild-monks");
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
