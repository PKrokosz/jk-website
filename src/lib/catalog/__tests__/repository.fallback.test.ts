import { afterAll, afterEach, describe, expect, it, vi } from "vitest";

import { catalogLeathers, catalogStyles } from "../data";
import { getFallbackProductTemplates } from "../products";

const sortById = <T extends { id: number }>(entries: readonly T[]): T[] =>
  [...entries].sort((a, b) => a.id - b.id);

const sortBySlug = <T extends { slug: string }>(entries: readonly T[]): T[] =>
  [...entries].sort((a, b) => a.slug.localeCompare(b.slug));

describe("catalog repository fallback", () => {
  const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

  afterAll(() => {
    warnSpy.mockRestore();
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.unmock("@jk/db");
  });

  it("zwraca dane referencyjne dla stylów gdy baza jest niedostępna", async () => {
    vi.doMock("@jk/db", () => {
      throw new Error("DATABASE_URL missing");
    });

    const { findActiveStyles } = await import("../repository");

    await expect(findActiveStyles()).resolves.toEqual(sortById(catalogStyles));
    expect(warnSpy).toHaveBeenCalled();
  });

  it("zwraca dane referencyjne dla skór gdy baza jest niedostępna", async () => {
    vi.doMock("@jk/db", () => {
      throw new Error("DATABASE_URL missing");
    });

    const { findActiveLeathers } = await import("../repository");

    await expect(findActiveLeathers()).resolves.toEqual(sortById(catalogLeathers));
    expect(warnSpy).toHaveBeenCalled();
  });

  it("zwraca referencyjne template produktów gdy baza jest niedostępna", async () => {
    vi.doMock("@jk/db", () => {
      throw new Error("DATABASE_URL missing");
    });

    const { loadCatalogProductTemplates } = await import("../repository");

    const result = await loadCatalogProductTemplates();

    expect(result.source).toBe("fallback");
    expect(result.data).toEqual(sortBySlug(getFallbackProductTemplates()));
    expect(warnSpy).toHaveBeenCalled();
  });
});
