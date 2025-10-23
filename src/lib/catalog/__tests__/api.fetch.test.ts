import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const NEXT_BUILD_PHASE = "phase-production-build";

const ORIGINAL_ENV = {
  NEXT_PHASE: process.env.NEXT_PHASE,
  MOCK_CATALOG_FETCH: process.env.MOCK_CATALOG_FETCH,
  FORCE_CATALOG_FROM_DB: process.env.FORCE_CATALOG_FROM_DB
};

function resetEnv() {
  if (ORIGINAL_ENV.NEXT_PHASE) {
    process.env.NEXT_PHASE = ORIGINAL_ENV.NEXT_PHASE;
  } else {
    delete process.env.NEXT_PHASE;
  }

  if (ORIGINAL_ENV.MOCK_CATALOG_FETCH) {
    process.env.MOCK_CATALOG_FETCH = ORIGINAL_ENV.MOCK_CATALOG_FETCH;
  } else {
    delete process.env.MOCK_CATALOG_FETCH;
  }

  if (ORIGINAL_ENV.FORCE_CATALOG_FROM_DB) {
    process.env.FORCE_CATALOG_FROM_DB = ORIGINAL_ENV.FORCE_CATALOG_FROM_DB;
  } else {
    delete process.env.FORCE_CATALOG_FROM_DB;
  }
}

describe("fetchCatalogResource build-time mock", () => {
  beforeEach(() => {
    vi.resetModules();
    const globalRef = globalThis as { __jk_catalog_cache?: unknown };
    delete globalRef.__jk_catalog_cache;
  });

  afterEach(() => {
    resetEnv();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.resetModules();
    const globalRef = globalThis as { __jk_catalog_cache?: unknown };
    delete globalRef.__jk_catalog_cache;
  });

  it("returns fallback catalog summaries without hitting fetch during build", async () => {
    process.env.NEXT_PHASE = NEXT_BUILD_PHASE;
    const fetchSpy = vi.fn(() => {
      throw new Error("fetch should not be called in mock mode");
    });
    vi.stubGlobal("fetch", fetchSpy as unknown as typeof fetch);
    vi.spyOn(console, "info").mockImplementation(() => {});

    const catalogApiModule = await import("../api");
    const products = await catalogApiModule.fetchCatalogProducts();

    expect(products.length).toBeGreaterThan(0);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("throws CatalogApiError with 404 for unknown slug in mock mode", async () => {
    process.env.MOCK_CATALOG_FETCH = "1";
    const fetchSpy = vi.fn(() => {
      throw new Error("fetch should not be called in mock mode");
    });
    vi.stubGlobal("fetch", fetchSpy as unknown as typeof fetch);
    vi.spyOn(console, "info").mockImplementation(() => {});

    const catalogApiModule = await import("../api");

    await expect(catalogApiModule.fetchCatalogProductDetail("unknown"))
      .rejects.toMatchObject({ status: 404 });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("honors FORCE_CATALOG_FROM_DB by bypassing mock fetch", async () => {
    process.env.MOCK_CATALOG_FETCH = "1";
    process.env.FORCE_CATALOG_FROM_DB = "true";

    const fetchSpy = vi.fn(async () =>
      new Response(
        JSON.stringify({ data: [] }),
        {
          headers: { "Content-Type": "application/json" },
          status: 200
        }
      )
    );

    vi.stubGlobal("fetch", fetchSpy as unknown as typeof fetch);

    const catalogApiModule = await import("../api");

    await catalogApiModule.fetchCatalogProducts();

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
