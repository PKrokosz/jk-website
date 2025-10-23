import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type {
  CatalogLeather,
  CatalogProductDetail,
  CatalogProductSummary,
  CatalogStyle
} from "../types";
import type { ProductTemplate } from "../products";

const mocks = vi.hoisted(() => {
  return {
    loadCatalogStyles: vi.fn<
      [],
      Promise<{ data: CatalogStyle[]; source: "database" | "fallback" }>
    >(),
    loadCatalogLeathers: vi.fn<
      [],
      Promise<{ data: CatalogLeather[]; source: "database" | "fallback" }>
    >(),
    loadCatalogProductTemplates: vi.fn<
      [],
      Promise<{ data: ProductTemplate[]; source: "database" | "fallback" }>
    >(),
    createProductsFromTemplates: vi.fn<
      [ProductTemplate[], CatalogStyle[], CatalogLeather[]],
      CatalogProductSummary[]
    >(),
    createProductDetailFromTemplate: vi.fn()
  };
});

vi.mock("../repository", () => ({
  loadCatalogStyles: mocks.loadCatalogStyles,
  loadCatalogLeathers: mocks.loadCatalogLeathers,
  loadCatalogProductTemplates: mocks.loadCatalogProductTemplates
}));

vi.mock("../products", () => ({
  createProductsFromTemplates: mocks.createProductsFromTemplates,
  createProductDetailFromTemplate: mocks.createProductDetailFromTemplate
}));

const baseStyle: CatalogStyle = {
  id: 1,
  slug: "classic",
  name: "Classic",
  era: "XV",
  description: "Styl referencyjny",
  basePriceGrosz: 12300
};

const baseLeather: CatalogLeather = {
  id: 1,
  name: "Brązowa",
  color: "Brown",
  finish: "Mat",
  priceModGrosz: 0,
  description: "Skóra referencyjna"
};

const baseTemplate: ProductTemplate = {
  id: "template-1",
  slug: "wilczy",
  name: "Wilczy",
  styleId: 1,
  leatherId: 1,
  description: "Opis",
  highlight: "Highlight",
  galleryImages: [],
  galleryCaptions: [],
  variantLeatherIds: [],
  sizes: [],
  craftProcess: [],
  seo: {
    title: "SEO",
    description: "Opis SEO",
    keywords: []
  },
  category: "footwear",
  funnelStage: "MOFU"
};

const baseSummary: CatalogProductSummary = {
  id: "summary-1",
  slug: baseTemplate.slug,
  name: "Model Wilczy",
  styleId: baseTemplate.styleId,
  leatherId: baseTemplate.leatherId,
  description: baseTemplate.description,
  highlight: baseTemplate.highlight,
  priceGrosz: 25900,
  category: "footwear",
  categoryLabel: "Buty",
  funnelStage: "MOFU",
  funnelLabel: "MOFU — konfiguracja"
};

const baseDetail: CatalogProductDetail = {
  ...baseSummary,
  gallery: [],
  variants: { colors: [], sizes: [] },
  craftProcess: [],
  seo: { title: "", description: "", keywords: [] }
};

describe("resolveCatalogCache", () => {
  const resetGlobalCache = () => {
    const globalRef = globalThis as { __jk_catalog_cache?: unknown };
    delete globalRef.__jk_catalog_cache;
  };

  beforeEach(() => {
    vi.resetModules();
    resetGlobalCache();
    mocks.loadCatalogStyles.mockReset();
    mocks.loadCatalogLeathers.mockReset();
    mocks.loadCatalogProductTemplates.mockReset();
    mocks.createProductsFromTemplates.mockReset();
    mocks.createProductDetailFromTemplate.mockReset();

    mocks.loadCatalogStyles.mockResolvedValue({
      data: [baseStyle],
      source: "fallback"
    });
    mocks.loadCatalogLeathers.mockResolvedValue({
      data: [baseLeather],
      source: "fallback"
    });
    mocks.loadCatalogProductTemplates.mockResolvedValue({
      data: [baseTemplate],
      source: "fallback"
    });
    mocks.createProductsFromTemplates.mockReturnValue([baseSummary]);
    mocks.createProductDetailFromTemplate.mockImplementation(() => baseDetail);
  });

  afterEach(() => {
    resetGlobalCache();
    vi.clearAllMocks();
  });

  it("reuses cached value until TTL expires and tracks hits", async () => {
    const catalogCacheModule = await import("../cache");

    const first = await catalogCacheModule.resolveCatalogCache(undefined, { ttlMs: 10_000 });
    const second = await catalogCacheModule.resolveCatalogCache();

    expect(first).toBe(second);
    expect(mocks.loadCatalogStyles).toHaveBeenCalledTimes(1);
    expect(mocks.loadCatalogLeathers).toHaveBeenCalledTimes(1);
    expect(mocks.loadCatalogProductTemplates).toHaveBeenCalledTimes(1);

    const snapshot = catalogCacheModule.getCatalogCacheSnapshot();
    expect(snapshot.hits).toBe(1);
    expect(snapshot.misses).toBe(1);
    expect(snapshot.fallbackCount).toBe(3);
    expect(snapshot.errorCount).toBe(0);
    expect(snapshot.stale).toBe(false);
  });

  it("returns previous payload when refresh fails after population", async () => {
    const catalogCacheModule = await import("../cache");

    await catalogCacheModule.resolveCatalogCache();

    const failingError = new Error("database offline");
    mocks.loadCatalogStyles.mockRejectedValueOnce(failingError);

    const refreshed = await catalogCacheModule.refreshCatalogCache();

    expect(refreshed.detailsBySlug[baseTemplate.slug]).toEqual(baseDetail);
    const snapshot = catalogCacheModule.getCatalogCacheSnapshot();
    expect(snapshot.errorCount).toBe(1);
    expect(snapshot.lastError).toBe(failingError.message);
    expect(snapshot.misses).toBe(2);
  });

  it("propagates the error when cache is empty", async () => {
    const failingError = new Error("seed unavailable");
    mocks.loadCatalogStyles.mockRejectedValueOnce(failingError);

    const catalogCacheModule = await import("../cache");

    await expect(catalogCacheModule.resolveCatalogCache()).rejects.toBe(failingError);

    const snapshot = catalogCacheModule.getCatalogCacheSnapshot();
    expect(snapshot.errorCount).toBe(1);
    expect(snapshot.lastError).toBe(failingError.message);
    expect(snapshot.lastUpdatedAt).toBeNull();
    expect(snapshot.misses).toBe(1);
    expect(snapshot.hits).toBe(0);
    expect(snapshot.stale).toBe(true);
  });
});
