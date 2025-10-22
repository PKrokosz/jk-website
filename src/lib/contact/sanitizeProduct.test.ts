import { describe, expect, it } from "vitest";

import { sanitizeProductQuery } from "./sanitizeProduct";

describe("sanitizeProductQuery", () => {
  it("returns an empty string for falsy values", () => {
    expect(sanitizeProductQuery(undefined)).toBe("");
    expect(sanitizeProductQuery(null)).toBe("");
  });

  it("normalizes whitespace and strips control characters", () => {
    expect(sanitizeProductQuery("  Oxford\nNo.8\t")).toBe("Oxford No.8");
  });

  it("limits the result to 120 characters", () => {
    const longValue = "x".repeat(200);
    expect(sanitizeProductQuery(longValue)).toHaveLength(120);
  });

  it("uses the first value when an array is provided", () => {
    expect(sanitizeProductQuery(["Model", "Other"])).toBe("Model");
  });
});
