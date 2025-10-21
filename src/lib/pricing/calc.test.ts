import { describe, expect, it } from "vitest";

import { calculateQuote } from "./calc";

describe("calculateQuote", () => {
  it("returns base pricing breakdown without options", () => {
    const quote = calculateQuote();

    expect(quote).toMatchObject({
      currency: "PLN",
      totalNetGrosz: 120_000,
      totalVatGrosz: 27_600,
      totalGrossGrosz: 147_600
    });
    expect(quote.breakdown).toEqual([
      { label: "Bazowa para", amountGrosz: 120_000 },
      { label: "VAT (23%)", amountGrosz: 27_600 }
    ]);
  });

  it("adds positive option modifiers to the totals", () => {
    const quote = calculateQuote({
      options: [
        { id: 1, priceModGrosz: 10_000 },
        { id: 2, priceModGrosz: 5_000 }
      ]
    });

    expect(quote.totalNetGrosz).toBe(135_000);
    expect(quote.totalVatGrosz).toBe(Math.round(135_000 * 0.23));
    expect(quote.totalGrossGrosz).toBe(quote.totalNetGrosz + quote.totalVatGrosz);
    expect(quote.breakdown).toContainEqual({ label: "Dodatkowe opcje", amountGrosz: 15_000 });
  });

  it("ignores negative option modifiers", () => {
    const quote = calculateQuote({
      options: [
        { id: 1, priceModGrosz: 10_000 },
        { id: 2, priceModGrosz: -5_000 }
      ]
    });

    expect(quote.totalNetGrosz).toBe(130_000);
    expect(quote.breakdown).toContainEqual({ label: "Dodatkowe opcje", amountGrosz: 10_000 });
  });
});
