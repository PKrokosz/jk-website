import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { pricingQuoteResponseSchema } from "@/lib/pricing/schemas";

vi.mock("@/lib/pricing/quote-requests-repository", () => ({
  countQuoteRequestsSince: vi.fn().mockResolvedValue(0),
  insertQuoteRequestLog: vi.fn().mockResolvedValue(undefined)
}));

const quoteRequestsRepository = await import("@/lib/pricing/quote-requests-repository");
const mockedCountQuoteRequestsSince = vi.mocked(
  quoteRequestsRepository.countQuoteRequestsSince
);
const mockedInsertQuoteRequestLog = vi.mocked(
  quoteRequestsRepository.insertQuoteRequestLog
);

const { POST } = await import("./route");

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
    mockedCountQuoteRequestsSince.mockClear();
    mockedInsertQuoteRequestLog.mockClear();
    mockedCountQuoteRequestsSince.mockResolvedValue(0);
    mockedInsertQuoteRequestLog.mockResolvedValue();
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
      "203.0.113.1",
      expect.any(Date),
      expect.any(Number)
    );
    expect(mockedInsertQuoteRequestLog).toHaveBeenCalledWith(
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
  });

  it("obsługuje pusty payload przez zastosowanie wartości domyślnych", async () => {
    const response = await POST(makeRequest({}));

    expect(response.status).toBe(200);
    const body = await response.json();
    const parsed = pricingQuoteResponseSchema.parse(body);

    expect(parsed.payload).toEqual({});
    expect(parsed.quote.totalNetGrosz).toBeGreaterThan(0);
    expect(mockedCountQuoteRequestsSince).toHaveBeenCalled();
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
});
