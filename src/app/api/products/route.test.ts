import { NextRequest } from "next/server";
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sampleSummary = {
  id: "sample-id",
  slug: "sample-slug",
  name: "Sample",
  styleId: 1,
  leatherId: 2,
  description: "Opis sample",
  highlight: "Wyróżnik",
  priceGrosz: 123_000,
  category: "footwear" as const,
  categoryLabel: "Buty",
  funnelStage: "MOFU" as const,
  funnelLabel: "MOFU — konfiguracja i porównanie oferty",
  orderReference: undefined
};

const sampleDetail = {
  ...sampleSummary,
  gallery: [
    { src: "/image/models/1.jfif", alt: "Model Sample — Ujęcie" }
  ],
  variants: { colors: [], sizes: [] },
  craftProcess: [],
  seo: { title: "Sample", description: "Sample", keywords: [] }
};

const resolveCatalogCacheMock = vi.fn();

vi.mock("@/lib/catalog/cache", () => ({
  resolveCatalogCache: resolveCatalogCacheMock
}));

vi.mock("@jk/db", async () => {
  const actual = await vi.importActual<typeof import("@jk/db")>("@jk/db");

  return {
    ...actual,
    createDbClient: vi.fn(() => ({
      db: {} as import("@jk/db").Database,
      pool: {} as unknown as import("pg").Pool
    }))
  };
});

const dbClientHelper = await import("@/lib/db/next-client");
const { resetNextDbClient } = dbClientHelper;

const dbModule = await import("@jk/db");
const mockedCreateDbClient = vi.mocked(dbModule.createDbClient);

const { GET } = await import("./route");

function makeRequest() {
  return new NextRequest("https://jkhandmade.pl/api/products");
}

describe("GET /api/products", () => {
  const ORIGINAL_DATABASE_URL = process.env.DATABASE_URL;
  const restoreDatabaseUrl = () => {
    if (typeof ORIGINAL_DATABASE_URL === "string") {
      process.env.DATABASE_URL = ORIGINAL_DATABASE_URL;
    } else {
      delete process.env.DATABASE_URL;
    }
  };
  const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

  beforeEach(() => {
    resetNextDbClient();
    mockedCreateDbClient.mockClear();
    mockedCreateDbClient.mockReturnValue({
      db: {} as import("@jk/db").Database,
      pool: {} as unknown as import("pg").Pool
    });
    process.env.DATABASE_URL = "postgres://test:test@localhost:5432/db";
    resolveCatalogCacheMock.mockResolvedValue({
      styles: [],
      leathers: [],
      templates: [],
      summaries: [sampleSummary],
      detailsBySlug: { [sampleDetail.slug]: sampleDetail },
      sources: { styles: "fallback", leathers: "fallback", templates: "fallback" },
      generatedAt: Date.now()
    });
  });

  afterEach(() => {
    resolveCatalogCacheMock.mockReset();
    resetNextDbClient();
    mockedCreateDbClient.mockReset();
    restoreDatabaseUrl();
  });

  afterAll(() => {
    resetNextDbClient();
    restoreDatabaseUrl();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it("zwraca listę produktów katalogu", async () => {
    const response = await GET(makeRequest());

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toEqual({ data: [sampleSummary] });
    expect(resolveCatalogCacheMock).toHaveBeenCalledTimes(1);
  });

  it("zwraca 500 w przypadku błędu cache", async () => {
    resolveCatalogCacheMock.mockRejectedValueOnce(new Error("cache down"));

    const response = await GET(makeRequest());

    expect(response.status).toBe(500);
  });

  it("korzysta z danych referencyjnych gdy brakuje konfiguracji bazy danych", async () => {
    delete process.env.DATABASE_URL;

    const response = await GET(makeRequest());

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toEqual({ data: [sampleSummary] });
    expect(resolveCatalogCacheMock).toHaveBeenCalledWith(undefined);
    expect(mockedCreateDbClient).not.toHaveBeenCalled();
  });
});
