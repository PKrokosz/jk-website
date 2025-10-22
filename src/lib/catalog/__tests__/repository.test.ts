import { describe, expect, it } from "vitest";

import { mapLeatherRowToCatalogLeather, mapStyleRowToCatalogStyle } from "../mappers";

describe("catalog repository mappers", () => {
  it("konwertuje rekord stylu na obiekt katalogu", () => {
    const record = {
      id: 1,
      slug: "courtly-riding-boot",
      name: "Courtly Riding Boot",
      basePriceGrosz: 289_000,
      era: "15th century",
      descriptionMd: "Opis w formacie markdown",
      active: true,
      createdAt: new Date()
    } as const;

    const mapped = mapStyleRowToCatalogStyle(record);

    expect(mapped).toEqual({
      id: 1,
      slug: "courtly-riding-boot",
      name: "Courtly Riding Boot",
      era: "15th century",
      description: "Opis w formacie markdown",
      basePriceGrosz: 289_000
    });
  });

  it("konwertuje rekord skóry na obiekt katalogu", () => {
    const record = {
      id: 2,
      name: "Bursztynowy pull-up",
      color: "Miód",
      finish: "Woskowana",
      description: "Skóra pull-up z woskowaną powłoką",
      priceModGrosz: 24_000,
      active: true
    } as const;

    const mapped = mapLeatherRowToCatalogLeather(record);

    expect(mapped).toEqual({
      id: 2,
      name: "Bursztynowy pull-up",
      color: "Miód",
      finish: "Woskowana",
      priceModGrosz: 24_000,
      description: "Skóra pull-up z woskowaną powłoką"
    });
  });

  it("stosuje wartości domyślne dla brakujących pól", () => {
    const styleMapped = mapStyleRowToCatalogStyle({
      id: 3,
      slug: "slug",
      name: "Nazwa",
      basePriceGrosz: 100_000
    } as any);

    const leatherMapped = mapLeatherRowToCatalogLeather({
      id: 4,
      name: "Warsztatowy mix",
      color: "Neutralny"
    } as any);

    expect(styleMapped.description).toBe("");
    expect(styleMapped.era).toBeUndefined();
    expect(leatherMapped.description).toBe("");
    expect(leatherMapped.finish).toBeUndefined();
    expect(leatherMapped.priceModGrosz).toBe(0);
  });
});
