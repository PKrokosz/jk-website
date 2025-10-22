import { describe, expect, it } from "vitest";

import { ORDER_ACCESSORIES } from "../orderAccessories";
import { ORDER_MODELS } from "../orderModels";
import { ORDER_EXTRAS } from "../orderExtras";

describe("Google form option formatting", () => {
  const pricePattern = / - \d+(?: \d{3})? zł$/;

  it("follows the `<label> - <price> zł` convention", () => {
    const entries = [
      ...ORDER_MODELS.map((model) => ({
        id: model.id,
        source: "ORDER_MODELS",
        value: model.googleValue
      })),
      ...ORDER_ACCESSORIES.map((accessory) => ({
        id: accessory.id,
        source: "ORDER_ACCESSORIES",
        value: accessory.googleValue
      })),
      ...ORDER_EXTRAS.map((extra) => ({
        id: extra.id,
        source: "ORDER_EXTRAS",
        value: extra.googleValue
      }))
    ];

    for (const entry of entries) {
      expect(entry.value, `${entry.source}:${entry.id}`).toMatch(pricePattern);
    }
  });
});
