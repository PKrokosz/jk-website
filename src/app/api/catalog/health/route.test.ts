import { NextRequest } from "next/server";
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const resolveCatalogCacheMock = vi.fn();
const getCatalogCacheSnapshotMock = vi.fn();

vi.mock("@/lib/catalog/cache", () => ({
  resolveCatalogCache: resolveCatalogCacheMock,
  getCatalogCacheSnapshot: getCatalogCacheSnapshotMock
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
  return new NextRequest("https://jkhandmade.pl/api/catalog/health");
}

describe("GET /api/catalog/health", () => {
  const ORIGINAL_DATABASE_URL = process.env.DATABASE_URL;
  const restoreDatabaseUrl = () => {
    if (typeof ORIGINAL_DATABASE_URL === "string") {
      process.env.DATABASE_URL = ORIGINAL_DATABASE_URL;
    } else {
      delete process.env.DATABASE_URL;
    }
  };
  const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

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
      summaries: [],
      detailsBySlug: {},
      sources: { styles: "database", leathers: "database", templates: "database" },
      generatedAt: Date.now()
    });
    getCatalogCacheSnapshotMock.mockReturnValue({
      lastUpdatedAt: Date.now(),
      expiresAt: Date.now() + 1000,
      hits: 1,
      misses: 0,
      fallbackCount: 0,
      errorCount: 0,
      stale: false
    });
  });

  afterEach(() => {
    resolveCatalogCacheMock.mockReset();
    getCatalogCacheSnapshotMock.mockReset();
    resetNextDbClient();
    mockedCreateDbClient.mockReset();
    restoreDatabaseUrl();
  });

  afterAll(() => {
    resetNextDbClient();
    restoreDatabaseUrl();
    consoleErrorSpy.mockRestore();
  });

  it("zwraca status healthy gdy cache aktualne", async () => {
    const response = await GET(makeRequest());

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.status).toBe("healthy");
    expect(body.counts).toEqual({ styles: 0, leathers: 0, products: 0 });
    expect(resolveCatalogCacheMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ forceRefresh: true })
    );
  });

  it("oznacza status jako degraded gdy użyto fallbacku", async () => {
    resolveCatalogCacheMock.mockResolvedValueOnce({
      styles: [],
      leathers: [],
      templates: [],
      summaries: [],
      detailsBySlug: {},
      sources: { styles: "fallback", leathers: "database", templates: "database" },
      generatedAt: Date.now()
    });

    const response = await GET(makeRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe("degraded");
  });

  it("zwraca 500 w przypadku błędu cache", async () => {
    resolveCatalogCacheMock.mockRejectedValueOnce(new Error("cache down"));

    const response = await GET(makeRequest());

    expect(response.status).toBe(500);
  });

  it("zwraca 500 gdy brakuje konfiguracji bazy danych", async () => {
    delete process.env.DATABASE_URL;

    const response = await GET(makeRequest());

    expect(response.status).toBe(500);
    expect(resolveCatalogCacheMock).not.toHaveBeenCalled();
    expect(mockedCreateDbClient).not.toHaveBeenCalled();
  });
});
