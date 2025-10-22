import { describe, expect, it, beforeEach, afterAll, afterEach, vi } from "vitest";

import { catalogLeathers } from "@/lib/catalog/data";

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

const resolveCatalogCacheMock = vi.fn();

vi.mock("@/lib/catalog/cache", () => ({
  resolveCatalogCache: resolveCatalogCacheMock
}));

const dbClientHelper = await import("@/lib/db/next-client");
const { resetNextDbClient, DatabaseConfigurationError } = dbClientHelper;

const dbModule = await import("@jk/db");
const mockedCreateDbClient = vi.mocked(dbModule.createDbClient);

const { GET } = await import("./route");

describe("GET /api/leather", () => {
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
      leathers: catalogLeathers,
      templates: [],
      summaries: [],
      detailsBySlug: {},
      sources: {
        styles: "fallback" as const,
        leathers: "fallback" as const,
        templates: "fallback" as const
      },
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

  it("zwraca listę skór dostępnych w katalogu", async () => {
    const response = await GET();

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data[0]).toHaveProperty("id");
    expect(resolveCatalogCacheMock).toHaveBeenCalledWith({});
  });

  it("zwraca 500 gdy repozytorium zwróci błąd", async () => {
    resolveCatalogCacheMock.mockRejectedValueOnce(new Error("cache down"));

    const response = await GET();

    expect(response.status).toBe(500);

    const body = await response.json();
    expect(body).toEqual(
      expect.objectContaining({
        error: expect.stringContaining("Nie udało się pobrać listy skór"),
      }),
    );
  });

  it("wraca do danych referencyjnych gdy brakuje konfiguracji bazy danych", async () => {
    delete process.env.DATABASE_URL;

    const response = await GET();

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toEqual(catalogLeathers);
    expect(resolveCatalogCacheMock).toHaveBeenCalledWith(undefined);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining("nie jest skonfigurowana"),
      expect.any(DatabaseConfigurationError)
    );
    expect(mockedCreateDbClient).not.toHaveBeenCalled();
  });
});
