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
    expect(quote.breakdown).toContainEqual({ label: "Opcja 1", amountGrosz: 10_000 });
    expect(quote.breakdown).toContainEqual({ label: "Opcja 2", amountGrosz: 5_000 });
  });

  it("ignores negative option modifiers", () => {
    const quote = calculateQuote({
      options: [
        { id: 1, priceModGrosz: 10_000 },
        { id: 2, priceModGrosz: -5_000 }
      ]
    });

    expect(quote.totalNetGrosz).toBe(130_000);
    expect(quote.breakdown).toContainEqual({ label: "Opcja 1", amountGrosz: 10_000 });
    expect(quote.breakdown.some((item) => item.label === "Opcja 2")).toBe(false);
  });

  it("supports custom base price and labels", () => {
    const quote = calculateQuote({
      basePriceGrosz: 200_000,
      baseLabel: "Model Dragonki",
      options: [{ id: "wax", label: "Wosk pielęgnacyjny", priceModGrosz: 6_000 }]
    });

    expect(quote.totalNetGrosz).toBe(206_000);
    expect(quote.breakdown[0]).toEqual({ label: "Model Dragonki", amountGrosz: 200_000 });
    expect(quote.breakdown).toContainEqual({ label: "Wosk pielęgnacyjny", amountGrosz: 6_000 });
    expect(quote.breakdown.at(-1)).toEqual({ label: "VAT (23%)", amountGrosz: Math.round(206_000 * 0.23) });
  });
});
