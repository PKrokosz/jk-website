import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Database } from "@jk/db";

import { catalogLeathers, catalogStyles } from "../data";

interface MockDatabaseConfig {
  styleRows?: Array<Record<string, unknown>>;
  leatherRows?: Array<Record<string, unknown>>;
  error?: Error;
  styleTable?: object;
  leatherTable?: object;
  productTemplateTable?: object;
}

function createMockDatabase({
  styleRows = [],
  leatherRows = [],
  error,
  styleTable: providedStyleTable,
  leatherTable: providedLeatherTable,
  productTemplateTable: providedProductTemplateTable
}: MockDatabaseConfig = {}): {
  database: Database;
  styleTable: object;
  leatherTable: object;
  productTemplateTable: object;
  fromSpy: ReturnType<typeof vi.fn>;
  selectSpy: ReturnType<typeof vi.fn>;
} {
  const styleTable = providedStyleTable ?? { table: "style" };
  const leatherTable = providedLeatherTable ?? { table: "leather" };
  const productTemplateTable = providedProductTemplateTable ?? { table: "product_template" };

  const implicitResponses = [styleRows, leatherRows, []];
  let nextImplicitIndex = 0;
  const tableResponses = new Map<unknown, unknown[]>();
  const baseNameSymbol = Symbol.for("drizzle:BaseName");

  const resolveTableName = (value: unknown): string | undefined => {
    if (typeof value !== "object" && typeof value !== "function") {
      return undefined;
    }

    if (value === null) {
      return undefined;
    }

    const tableName = Reflect.get(value as object, baseNameSymbol);
    return typeof tableName === "string" ? tableName : undefined;
  };

  const fromSpy = vi.fn(async (table: unknown) => {
    if (error) {
      throw error;
    }

    if (table === styleTable) {
      return styleRows;
    }

    if (table === leatherTable) {
      return leatherRows;
    }

    if (table === productTemplateTable) {
      return [];
    }

    const tableName = resolveTableName(table);

    if (tableName === "style") {
      return styleRows;
    }

    if (tableName === "leather") {
      return leatherRows;
    }

    if (tableName === "product_template") {
      return [];
    }

    if (!tableResponses.has(table)) {
      const response = implicitResponses[Math.min(nextImplicitIndex, implicitResponses.length - 1)];
      tableResponses.set(table, response);
      nextImplicitIndex += 1;
    }

    const response = tableResponses.get(table);

    if (!response) {
      throw new Error("Unexpected table");
    }

    return response;

  });

  const selectSpy = vi.fn(() => ({ from: fromSpy }));

  return {
    database: { select: selectSpy } as unknown as Database,
    styleTable,
    leatherTable,
    productTemplateTable,
    fromSpy,
    selectSpy
  };
}

describe("catalog repository database mocking", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.unmock("@jk/db");
  });

  it("returns rows from the mocked database when entries are active", async () => {
    const actualDbModule = await vi.importActual<typeof import("@jk/db")>("@jk/db");

    vi.doMock("@jk/db", () => actualDbModule);

    const { database } = createMockDatabase({
      styleRows: [
        {
          id: 101,
          slug: "mocked-style",
          name: "Mocked Style",
          basePriceGrosz: 12345,
          era: "18th",
          descriptionMd: "**mock**",
          active: true,
          createdAt: null
        }
      ],
      leatherRows: [
        {
          id: 201,
          name: "Mocked Leather",
          color: "Burgundy",
          finish: "Matte",
          description: "Test row",
          priceModGrosz: 999,
          active: true
        }
      ],
      styleTable: actualDbModule.style,
      leatherTable: actualDbModule.leather,
      productTemplateTable: actualDbModule.productTemplate
    });

    const catalogRepositoryModule = await import("../repository");
    catalogRepositoryModule.__catalogRepositoryInternals.resetDbModuleCache();

    const stylesResult = await catalogRepositoryModule.loadCatalogStyles(database);
    const leathersResult = await catalogRepositoryModule.loadCatalogLeathers(database);

    expect(stylesResult.source).toBe("database");
    expect(stylesResult.data).toEqual([
      {
        id: 101,
        slug: "mocked-style",
        name: "Mocked Style",
        era: "18th",
        description: "**mock**",
        basePriceGrosz: 12345
      }
    ]);

    expect(leathersResult.source).toBe("database");
    expect(leathersResult.data).toEqual([
      {
        id: 201,
        name: "Mocked Leather",
        color: "Burgundy",
        finish: "Matte",
        description: "Test row",
        priceModGrosz: 999
      }
    ]);
  });

  it("falls back to reference data when the database throws an error", async () => {
    const mockError = new Error("db failed");
    const actualDbModule = await vi.importActual<typeof import("@jk/db")>("@jk/db");

    vi.doMock("@jk/db", () => actualDbModule);

    const { database } = createMockDatabase({
      error: mockError,
      styleTable: actualDbModule.style,
      leatherTable: actualDbModule.leather,
      productTemplateTable: actualDbModule.productTemplate
    });

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const catalogRepositoryModule = await import("../repository");
    catalogRepositoryModule.__catalogRepositoryInternals.resetDbModuleCache();

    const stylesResult = await catalogRepositoryModule.loadCatalogStyles(database);
    const leathersResult = await catalogRepositoryModule.loadCatalogLeathers(database);

    expect(stylesResult.source).toBe("fallback");
    expect(stylesResult.data).toEqual([...catalogStyles].sort((a, b) => a.id - b.id));

    expect(leathersResult.source).toBe("fallback");
    expect(leathersResult.data).toEqual([...catalogLeathers].sort((a, b) => a.id - b.id));

    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("falls back to reference data when the database returns only inactive rows", async () => {
    const actualDbModule = await vi.importActual<typeof import("@jk/db")>("@jk/db");

    vi.doMock("@jk/db", () => actualDbModule);

    const { database } = createMockDatabase({
      styleRows: [
        {
          id: 301,
          slug: "inactive-style",
          name: "Inactive Style",
          basePriceGrosz: 54321,
          era: null,
          descriptionMd: "inactive",
          active: false,
          createdAt: null
        }
      ],
      leatherRows: [
        {
          id: 401,
          name: "Inactive Leather",
          color: "Black",
          finish: null,
          description: "inactive",
          priceModGrosz: 0,
          active: false
        }
      ],
      styleTable: actualDbModule.style,
      leatherTable: actualDbModule.leather,
      productTemplateTable: actualDbModule.productTemplate
    });

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const catalogRepositoryModule = await import("../repository");
    catalogRepositoryModule.__catalogRepositoryInternals.resetDbModuleCache();

    const stylesResult = await catalogRepositoryModule.loadCatalogStyles(database);
    const leathersResult = await catalogRepositoryModule.loadCatalogLeathers(database);

    expect(stylesResult.source).toBe("fallback");
    expect(stylesResult.data).toEqual([...catalogStyles].sort((a, b) => a.id - b.id));

    expect(leathersResult.source).toBe("fallback");
    expect(leathersResult.data).toEqual([...catalogLeathers].sort((a, b) => a.id - b.id));

    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
