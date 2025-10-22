import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("loadDbModule", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("caches the imported module after the first successful call", async () => {
    const accessCounts = { style: 0, leather: 0, productTemplate: 0 };

    vi.doMock("@jk/db", () => ({
      get style() {
        accessCounts.style += 1;
        return { tableName: "styles" };
      },
      get leather() {
        accessCounts.leather += 1;
        return { tableName: "leathers" };
      },
      get productTemplate() {
        accessCounts.productTemplate += 1;
        return { tableName: "product_templates" };
      }
    }));

    const { __catalogRepositoryInternals } = await import("../repository");

    const result = await __catalogRepositoryInternals.loadDbModule();

    expect(result).toEqual({
      style: { tableName: "styles" },
      leather: { tableName: "leathers" },
      productTemplate: { tableName: "product_templates" }
    });
    expect(__catalogRepositoryInternals.getCachedDbModule()).toBe(result);
    expect(accessCounts).toEqual({ style: 1, leather: 1, productTemplate: 1 });
  });

  it("returns the cached module on subsequent calls without re-importing", async () => {
    const accessCounts = { style: 0, leather: 0, productTemplate: 0 };

    vi.doMock("@jk/db", () => ({
      get style() {
        accessCounts.style += 1;
        return { tableName: "styles" };
      },
      get leather() {
        accessCounts.leather += 1;
        return { tableName: "leathers" };
      },
      get productTemplate() {
        accessCounts.productTemplate += 1;
        return { tableName: "product_templates" };
      }
    }));

    const { __catalogRepositoryInternals } = await import("../repository");

    const firstResult = await __catalogRepositoryInternals.loadDbModule();
    const secondResult = await __catalogRepositoryInternals.loadDbModule();

    expect(secondResult).toBe(firstResult);
    expect(accessCounts).toEqual({ style: 1, leather: 1, productTemplate: 1 });
  });

  it("returns null and logs a warning when the import fails", async () => {
    vi.doMock("@jk/db", () => {
      throw new Error("Database unavailable");
    });
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const { __catalogRepositoryInternals } = await import("../repository");

    const result = await __catalogRepositoryInternals.loadDbModule();

    expect(result).toBeNull();
    expect(__catalogRepositoryInternals.getCachedDbModule()).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith(
      "Baza danych katalogu jest niedostępna — korzystamy z danych referencyjnych",
      expect.any(Error)
    );
  });
});
