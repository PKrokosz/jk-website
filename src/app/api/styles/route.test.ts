import { describe, expect, it, beforeEach, afterAll, afterEach, vi } from "vitest";

import { catalogStyles } from "@/lib/catalog/data";

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

const findActiveStylesMock = vi.fn();

vi.mock("@/lib/catalog/repository", () => ({
  findActiveStyles: findActiveStylesMock,
}));

const dbClientHelper = await import("@/lib/db/next-client");
const { resetNextDbClient } = dbClientHelper;

const dbModule = await import("@jk/db");
const mockedCreateDbClient = vi.mocked(dbModule.createDbClient);

const { GET } = await import("./route");

describe("GET /api/styles", () => {
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
    findActiveStylesMock.mockResolvedValue(catalogStyles);
  });

  afterEach(() => {
    findActiveStylesMock.mockReset();
    resetNextDbClient();
    mockedCreateDbClient.mockReset();
    restoreDatabaseUrl();
  });

  afterAll(() => {
    resetNextDbClient();
    restoreDatabaseUrl();
    consoleErrorSpy.mockRestore();
  });

  it("zwraca listę stylów do katalogu", async () => {
    const response = await GET();

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data).toHaveLength(catalogStyles.length);
  });

  it("zwraca 500 gdy pobranie danych kończy się błędem", async () => {
    findActiveStylesMock.mockRejectedValueOnce(new Error("db down"));

    const response = await GET();

    expect(response.status).toBe(500);

    const body = await response.json();
    expect(body).toEqual(
      expect.objectContaining({
        error: expect.stringContaining("Nie udało się pobrać listy stylów"),
      }),
    );
  });

  it("zwraca 500 gdy brakuje konfiguracji bazy danych", async () => {
    delete process.env.DATABASE_URL;

    const response = await GET();

    expect(response.status).toBe(500);
    expect(findActiveStylesMock).not.toHaveBeenCalled();
    expect(mockedCreateDbClient).not.toHaveBeenCalled();
  });
});
