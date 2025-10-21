import { describe, expect, it } from "vitest";

import { ORDER_ACCESSORIES } from "@/config/orderAccessories";
import { ORDER_FORM_ENTRIES } from "@/config/orderFormEntries";
import { ORDER_COLORS } from "@/config/orderOptions";
import { ORDER_MODELS } from "@/config/orderModels";

import { buildGoogleFormPayload } from "../googleForm";
import { orderFormSchema } from "../schema";

describe("buildGoogleFormPayload", () => {
  it("maps order values to Google Form parameters", () => {
    const formValues = orderFormSchema.parse({
      fullName: "Jan Kowalski",
      phoneNumber: "+48123456789",
      parcelLockerCode: "WAW123",
      email: "jan@example.com",
      footLength: "27.5",
      instepCircumference: "24",
      calfCircumference: "",
      modelId: ORDER_MODELS[0].id,
      color: ORDER_COLORS[0].id,
      size: "42",
      accessories: [ORDER_ACCESSORIES[0].id],
      waterskin: { selected: true, symbol: "Smok" },
      bracer: { selected: true, color: "Czarny" },
      shoeTrees: true,
      discountCode: "PROMO",
      notes: "Dodatkowe informacje"
    });

    const params = buildGoogleFormPayload(formValues);

    expect(params.get(ORDER_FORM_ENTRIES.fullName)).toBe("Jan Kowalski");
    expect(params.get(ORDER_FORM_ENTRIES.phoneNumber)).toBe("+48123456789");
    expect(params.get(ORDER_FORM_ENTRIES.email)).toBe("jan@example.com");
    expect(params.getAll(ORDER_FORM_ENTRIES.accessories)).toContain(
      ORDER_ACCESSORIES[0].googleValue
    );
    expect(params.getAll(ORDER_FORM_ENTRIES.waterskin)).toEqual([
      "Bukłak - 250 zł",
      "__other_option__"
    ]);
    expect(params.get(`${ORDER_FORM_ENTRIES.waterskin}.other_option_response`)).toBe("Smok");
    expect(params.getAll(ORDER_FORM_ENTRIES.bracer)).toEqual([
      "Dodaj karwasz - 280 zł",
      "__other_option__"
    ]);
    expect(params.get(`${ORDER_FORM_ENTRIES.bracer}.other_option_response`)).toBe("Czarny");
    expect(params.get(ORDER_FORM_ENTRIES.shoeTrees)).toContain("prawidła");
    expect(params.get("fvv")).toBeDefined();
    expect(params.get("pageHistory")).toBeDefined();
    expect(params.get("fbzx")).toBeDefined();
  });
});
