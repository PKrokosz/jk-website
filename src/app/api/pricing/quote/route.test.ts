import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { pricingQuoteResponseSchema } from "@/lib/pricing/schemas";

const { POST } = await import("./route");

function makeRequest(body: unknown) {
  return new NextRequest("https://jkhandmade.pl/api/pricing/quote", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  });
}

describe("POST /api/pricing/quote", () => {
  it("zwraca poprawną wycenę dla prawidłowego payloadu", async () => {
    const response = await POST(
      makeRequest({
        basePriceGrosz: 150_000,
        baseLabel: "Model Krakus",
        options: [
          { id: "skora-calf", label: "Skóra cielęca", priceModGrosz: 20_000 },
          { id: "napinacz", priceModGrosz: 5_000 }
        ]
      })
    );

    expect(response.status).toBe(200);

    const body = await response.json();
    const parsed = pricingQuoteResponseSchema.parse(body);

    expect(parsed.payload.baseLabel).toBe("Model Krakus");
    expect(parsed.quote.totalGrossGrosz).toBeGreaterThan(parsed.quote.totalNetGrosz);
    expect(parsed.quote.breakdown.length).toBeGreaterThan(1);
  });

  it("zwraca błąd walidacji dla niepoprawnego payloadu", async () => {
    const response = await POST(
      makeRequest({
        basePriceGrosz: -500,
        options: [{ id: "invalid", priceModGrosz: -100 }]
      })
    );

    expect(response.status).toBe(422);
  });

  it("obsługuje pusty payload przez zastosowanie wartości domyślnych", async () => {
    const response = await POST(makeRequest({}));

    expect(response.status).toBe(200);
    const body = await response.json();
    const parsed = pricingQuoteResponseSchema.parse(body);

    expect(parsed.payload).toEqual({});
    expect(parsed.quote.totalNetGrosz).toBeGreaterThan(0);
  });
});
