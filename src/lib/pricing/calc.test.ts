import { describe, expect, it } from "vitest";
import { calculateQuote } from "./calc";

describe("calculateQuote", () => {
  it("returns base quote when no options provided", () => {
    const quote = calculateQuote();
    expect(quote.totalNetGrosz).toBe(120_000);
    expect(quote.totalGrossGrosz).toBe(147_600);
    expect(quote.breakdown).toHaveLength(2);
  });

  it("sums option price modifiers", () => {
    const quote = calculateQuote({
      options: [
        { id: 1, priceModGrosz: 10_000 },
        { id: 2, priceModGrosz: 5_000 }
      ]
    });

    expect(quote.totalNetGrosz).toBe(135_000);
    expect(quote.breakdown.some((item) => item.label === "Dodatkowe opcje")).toBe(
      true
    );
  });
});
