import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { pricingQuoteResponseSchema } from "@/lib/pricing/schemas";

vi.mock("@jk/db", async () => {
  const actual = await vi.importActual<typeof import("@jk/db")>("@jk/db");

  return {
    ...actual,
    createDbClient: vi.fn(
      () => ({
        db: {} as import("@jk/db").Database,
        pool: {} as unknown as import("pg").Pool
      })
    )
  };
});

vi.mock("@/lib/pricing/quote-requests-repository", () => ({
  countQuoteRequestsSince: vi.fn().mockResolvedValue(0),
  insertQuoteRequestLog: vi.fn().mockResolvedValue(undefined)
}));

const dbClientHelper = await import("@/lib/db/next-client");
const { resetNextDbClient } = dbClientHelper;

const dbModule = await import("@jk/db");
const mockedCreateDbClient = vi.mocked(dbModule.createDbClient);

const pricingQuoteRequestsRepositoryModule = await import(
  "@/lib/pricing/quote-requests-repository"
);
const mockedCountQuoteRequestsSince = vi.mocked(
  pricingQuoteRequestsRepositoryModule.countQuoteRequestsSince
);
const mockedInsertQuoteRequestLog = vi.mocked(
  pricingQuoteRequestsRepositoryModule.insertQuoteRequestLog
);

const { POST } = await import("./route");

const ORIGINAL_DATABASE_URL = process.env.DATABASE_URL;
const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

function makeRequest(body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest("https://jkhandmade.pl/api/pricing/quote", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...headers
    },
    body: JSON.stringify(body)
  });
}

describe("POST /api/pricing/quote", () => {
  beforeEach(() => {
    resetNextDbClient();
    mockedCreateDbClient.mockClear();
    mockedCreateDbClient.mockReturnValue({
      db: {} as import("@jk/db").Database,
      pool: {} as unknown as import("pg").Pool
    });
    mockedCountQuoteRequestsSince.mockClear();
    mockedInsertQuoteRequestLog.mockClear();
    mockedCountQuoteRequestsSince.mockResolvedValue(0);
    mockedInsertQuoteRequestLog.mockResolvedValue();
    process.env.DATABASE_URL = "postgres://test:test@localhost:5432/db";
  });

  it("zwraca poprawną wycenę dla prawidłowego payloadu", async () => {
    const response = await POST(
      makeRequest({
        basePriceGrosz: 150_000,
        baseLabel: "Model Krakus",
        options: [
          { id: "skora-calf", label: "Skóra cielęca", priceModGrosz: 20_000 },
          { id: "napinacz", priceModGrosz: 5_000 }
        ]
      }, { "x-forwarded-for": "203.0.113.1" })
    );

    expect(response.status).toBe(200);

    const body = await response.json();
    const parsed = pricingQuoteResponseSchema.parse(body);

    expect(parsed.payload.baseLabel).toBe("Model Krakus");
    expect(parsed.quote.totalGrossGrosz).toBeGreaterThan(parsed.quote.totalNetGrosz);
    expect(parsed.quote.breakdown.length).toBeGreaterThan(1);
    expect(mockedCountQuoteRequestsSince).toHaveBeenCalledWith(
      expect.anything(),
      "203.0.113.1",
      expect.any(Date),
      expect.any(Number)
    );
    expect(mockedInsertQuoteRequestLog).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        ipAddress: "203.0.113.1",
        payload: parsed.payload,
        quote: parsed.quote
      })
    );
  });

  it("zwraca błąd walidacji dla niepoprawnego payloadu", async () => {
    const response = await POST(
      makeRequest({
        basePriceGrosz: -500,
        options: [{ id: "invalid", priceModGrosz: -100 }]
      })
    );

    expect(response.status).toBe(422);
    expect(mockedCountQuoteRequestsSince).not.toHaveBeenCalled();
    expect(mockedInsertQuoteRequestLog).not.toHaveBeenCalled();
    expect(mockedCreateDbClient).not.toHaveBeenCalled();
  });

  it("obsługuje pusty payload przez zastosowanie wartości domyślnych", async () => {
    const response = await POST(makeRequest({}));

    expect(response.status).toBe(200);
    const body = await response.json();
    const parsed = pricingQuoteResponseSchema.parse(body);

    expect(parsed.payload).toEqual({});
    expect(parsed.quote.totalNetGrosz).toBeGreaterThan(0);
    expect(mockedCountQuoteRequestsSince).toHaveBeenCalledWith(
      expect.anything(),
      expect.any(String),
      expect.any(Date),
      expect.any(Number)
    );
    expect(mockedInsertQuoteRequestLog).toHaveBeenCalled();
  });

  it("zwraca błąd 429 gdy IP przekroczy limit zapytań", async () => {
    mockedCountQuoteRequestsSince.mockResolvedValue(10);

    const response = await POST(makeRequest({}, { "x-forwarded-for": "198.51.100.42" }));

    expect(response.status).toBe(429);
    expect(mockedInsertQuoteRequestLog).not.toHaveBeenCalled();
  });

  it("zwraca błąd 500 gdy zapis logu się nie powiedzie", async () => {
    mockedInsertQuoteRequestLog.mockRejectedValue(new Error("db down"));

    const response = await POST(makeRequest({}, { "x-forwarded-for": "192.0.2.15" }));

    expect(response.status).toBe(500);
  });

  it("zwraca błąd 500 gdy brakuje konfiguracji bazy danych", async () => {
    delete process.env.DATABASE_URL;

    const response = await POST(makeRequest({}));

    expect(response.status).toBe(500);
    expect(mockedCreateDbClient).not.toHaveBeenCalled();
    expect(mockedCountQuoteRequestsSince).not.toHaveBeenCalled();
    expect(mockedInsertQuoteRequestLog).not.toHaveBeenCalled();
  });
});

afterAll(() => {
  resetNextDbClient();
  process.env.DATABASE_URL = ORIGINAL_DATABASE_URL;
  consoleErrorSpy.mockRestore();
});
