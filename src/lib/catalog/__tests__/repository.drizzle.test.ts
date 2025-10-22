import { beforeEach, describe, expect, it, vi } from "vitest";

import { catalogLeathers, catalogStyles } from "../data";
import {
  referenceLeathers,
  referenceProductTemplates,
  referenceStyles
} from "@jk/db/seed-data";
import { getFallbackProductTemplates } from "../products";

const sortById = <T extends { id: number }>(entries: readonly T[]): T[] =>
  [...entries].sort((a, b) => a.id - b.id);

const sortBySlug = <T extends { slug: string }>(entries: readonly T[]): T[] =>
  [...entries].sort((a, b) => a.slug.localeCompare(b.slug));

describe("catalog repository with database connection", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns active styles mapped from Drizzle rows", async () => {
    const { findActiveStyles } = await import("../repository");
    const { style } = await import("@jk/db");

    const styleRows = referenceStyles.map((entry) => ({
      id: entry.id,
      slug: entry.slug,
      name: entry.name,
      basePriceGrosz: entry.basePriceGrosz,
      era: entry.era ?? null,
      descriptionMd: entry.description,
      active: entry.active ?? true,
      createdAt: null
    }));

    const inactiveRow = {
      ...styleRows[0],
      id: 999,
      active: false
    };

    const fromSpy = vi.fn().mockResolvedValue([...styleRows, inactiveRow]);
    const selectSpy = vi.fn(() => ({ from: fromSpy }));

    const database = {
      select: selectSpy
    } as unknown as import("@jk/db").Database;

    const styles = await findActiveStyles(database);

    expect(selectSpy).toHaveBeenCalledTimes(1);
    expect(fromSpy).toHaveBeenCalledWith(style);
    expect(styles).toEqual(sortById(catalogStyles));
    expect(styles.some((entry) => entry.id === inactiveRow.id)).toBe(false);
  });

  it("returns active leathers mapped from Drizzle rows", async () => {
    const { findActiveLeathers } = await import("../repository");
    const { leather } = await import("@jk/db");

    const leatherRows = referenceLeathers.map((entry) => ({
      id: entry.id,
      name: entry.name,
      color: entry.color,
      finish: entry.finish ?? null,
      priceModGrosz: entry.priceModGrosz,
      description: entry.description,
      active: entry.active ?? true
    }));

    const inactiveRow = {
      ...leatherRows[0],
      id: 999,
      active: false
    };

    const fromSpy = vi.fn().mockResolvedValue([...leatherRows, inactiveRow]);
    const selectSpy = vi.fn(() => ({ from: fromSpy }));

    const database = {
      select: selectSpy
    } as unknown as import("@jk/db").Database;

    const leathers = await findActiveLeathers(database);

    expect(selectSpy).toHaveBeenCalledTimes(1);
    expect(fromSpy).toHaveBeenCalledWith(leather);
    expect(leathers).toEqual(sortById(catalogLeathers));
    expect(leathers.some((entry) => entry.id === inactiveRow.id)).toBe(false);
  });

  it("returns product templates mapped from Drizzle rows", async () => {
    const { loadCatalogProductTemplates } = await import("../repository");
    const { productTemplate } = await import("@jk/db");

    const templateRows = referenceProductTemplates.map((entry, index) => ({
      id: index + 1,
      templateId: entry.templateId,
      slug: entry.slug,
      name: entry.name,
      styleId: entry.styleId,
      leatherId: entry.leatherId,
      descriptionMd: entry.description,
      highlight: entry.highlight,
      galleryImages: entry.galleryImages,
      galleryCaptions: entry.galleryCaptions,
      variantLeatherIds: entry.variantLeatherIds,
      sizes: entry.sizes,
      craftProcess: entry.craftProcess,
      seo: entry.seo,
      category: entry.category,
      funnelStage: entry.funnelStage,
      orderReference: entry.orderReference ?? null,
      priceOverrideGrosz: entry.priceOverrideGrosz ?? null
    }));

    const fromSpy = vi.fn().mockResolvedValue(templateRows);
    const selectSpy = vi.fn(() => ({ from: fromSpy }));

    const database = {
      select: selectSpy
    } as unknown as import("@jk/db").Database;

    const result = await loadCatalogProductTemplates(database);
    const fallbackTemplates = sortBySlug(getFallbackProductTemplates());

    expect(selectSpy).toHaveBeenCalledTimes(1);
    expect(fromSpy).toHaveBeenCalledWith(productTemplate);
    expect(result.source).toBe("database");
    expect(result.data).toEqual(fallbackTemplates);
  });
});
