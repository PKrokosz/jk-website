import { NextRequest } from "next/server";
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { catalogLeathers, catalogStyles } from "@/lib/catalog/data";
import {
  catalogProductDetailResponseSchema,
  catalogProductListResponseSchema
} from "@/lib/catalog/schemas";

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
const findActiveLeathersMock = vi.fn();

vi.mock("@/lib/catalog/repository", () => ({
  findActiveStyles: findActiveStylesMock,
  findActiveLeathers: findActiveLeathersMock
}));

const dbClientHelper = await import("@/lib/db/next-client");
const { resetNextDbClient } = dbClientHelper;

const dbModule = await import("@jk/db");
const mockedCreateDbClient = vi.mocked(dbModule.createDbClient);

const { GET } = await import("./route");

function makeRequest(path = "") {
  return new NextRequest(`https://jkhandmade.pl/api/products${path}`);
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

  beforeEach(() => {
    resetNextDbClient();
    mockedCreateDbClient.mockClear();
    mockedCreateDbClient.mockReturnValue({
      db: {} as import("@jk/db").Database,
      pool: {} as unknown as import("pg").Pool
    });
    process.env.DATABASE_URL = "postgres://test:test@localhost:5432/db";
    findActiveStylesMock.mockResolvedValue(catalogStyles);
    findActiveLeathersMock.mockResolvedValue(catalogLeathers);
  });

  afterEach(() => {
    findActiveStylesMock.mockReset();
    findActiveLeathersMock.mockReset();
    resetNextDbClient();
    mockedCreateDbClient.mockReset();
    restoreDatabaseUrl();
  });

  afterAll(() => {
    resetNextDbClient();
    restoreDatabaseUrl();
    consoleErrorSpy.mockRestore();
  });

  it("zwraca listę produktów katalogu", async () => {
    const response = await GET(makeRequest());

    expect(response.status).toBe(200);

    const body = await response.json();
    const parsed = catalogProductListResponseSchema.parse(body);

    expect(parsed.data.length).toBeGreaterThan(0);
    expect(parsed.data[0]).toHaveProperty("slug");
  });

  it("zwraca szczegóły produktu gdy podano slug", async () => {
    const response = await GET(makeRequest("?slug=szpic"));

    expect(response.status).toBe(200);

    const body = await response.json();
    const parsed = catalogProductDetailResponseSchema.parse(body);

    expect(parsed.data.slug).toBe("szpic");
    expect(parsed.data.gallery.length).toBeGreaterThan(0);
  });

  it("zwraca 404 dla nieistniejącego produktu", async () => {
    const response = await GET(makeRequest("?slug=nie-istnieje"));

    expect(response.status).toBe(404);
  });

  it("odrzuca niepoprawne query parametry", async () => {
    const response = await GET(makeRequest("?slug="));

    expect(response.status).toBe(422);
    expect(findActiveStylesMock).not.toHaveBeenCalled();
    expect(mockedCreateDbClient).not.toHaveBeenCalled();
  });

  it("zwraca 500 w przypadku błędu bazy", async () => {
    findActiveStylesMock.mockRejectedValueOnce(new Error("db down"));

    const response = await GET(makeRequest());

    expect(response.status).toBe(500);
  });

  it("zwraca 500 gdy brakuje konfiguracji bazy danych", async () => {
    delete process.env.DATABASE_URL;

    const response = await GET(makeRequest());

    expect(response.status).toBe(500);
    expect(findActiveStylesMock).not.toHaveBeenCalled();
    expect(mockedCreateDbClient).not.toHaveBeenCalled();
  });
});
