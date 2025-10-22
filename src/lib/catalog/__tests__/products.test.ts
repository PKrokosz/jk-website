import { describe, expect, it } from "vitest";

import { catalogLeathers, catalogStyles } from "@/lib/catalog/data";
import { createMockProducts, getProductBySlug, listProductSlugs } from "@/lib/catalog/products";

describe("catalog products helpers", () => {
  it("creates product summaries with slugs", () => {
    const products = createMockProducts(catalogStyles, catalogLeathers);

    expect(products).toHaveLength(15);
    expect(products[0]).toMatchObject({
      slug: "szpic",
      priceGrosz: 75_000,
      category: "footwear",
      funnelStage: expect.stringMatching(/TOFU|MOFU|BOFU/)
    });

    const shoeTrees = products.find((product) => product.slug === "prawidla-sosnowe");
    expect(shoeTrees?.priceGrosz).toBe(15_000);
  });

  it("returns detailed product data by slug", () => {
    const detail = getProductBySlug("buklak-podrozny", catalogStyles, catalogLeathers);

    expect(detail?.gallery).toHaveLength(3);
    expect(detail?.variants.colors.length).toBe(0);
    expect(detail?.category).toBe("hydration");
    expect(detail?.orderReference?.id).toBe("waterskin");
  });

  it("lists all product slugs", () => {
    const slugs = listProductSlugs();

    expect(slugs).toContain("prawidla-sosnowe");
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
