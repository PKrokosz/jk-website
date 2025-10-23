import { afterEach, describe, expect, it, vi } from "vitest";

import { ORDER_ACCESSORIES } from "@/config/orderAccessories";
import { ORDER_FORM_ENTRIES } from "@/config/orderFormEntries";
import { ORDER_COLORS, ORDER_SIZES } from "@/config/orderOptions";
import { ORDER_MODELS } from "@/config/orderModels";
import { ORDER_EXTRA_MAP } from "@/config/orderExtras";

import { GOOGLE_FORM_CONSTANTS } from "@/config/orderFormEntries";

import { buildGoogleFormPayload, submitOrderToGoogle } from "../googleForm";
import { orderFormSchema } from "../schema";

describe("buildGoogleFormPayload", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

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
      ORDER_EXTRA_MAP.waterskin.googleValue,
      "__other_option__"
    ]);
    expect(params.get(`${ORDER_FORM_ENTRIES.waterskin}.other_option_response`)).toBe("Smok");
    expect(params.getAll(ORDER_FORM_ENTRIES.bracer)).toEqual([
      ORDER_EXTRA_MAP.bracer.googleValue,
      "__other_option__"
    ]);
    expect(params.get(`${ORDER_FORM_ENTRIES.bracer}.other_option_response`)).toBe("Czarny");
    expect(params.get(ORDER_FORM_ENTRIES.shoeTrees)).toBe(
      ORDER_EXTRA_MAP.shoeTrees.googleValue
    );
    expect(params.get("fvv")).toBeDefined();
    expect(params.get("pageHistory")).toBeDefined();
    expect(params.get("fbzx")).toBeDefined();
  });

  it("formats numeric measurements and skips optional extras when empty", () => {
    const formValues = orderFormSchema.parse({
      fullName: "  Anna Zielińska  ",
      phoneNumber: "  +48111222333  ",
      parcelLockerCode: "  WAW321  ",
      email: "anna@example.com  ",
      footLength: 27.25,
      instepCircumference: "23,5",
      calfCircumference: "",
      modelId: ORDER_MODELS[0].id,
      color: ORDER_COLORS[0].id,
      size: ORDER_SIZES[0].id,
      accessories: [],
      waterskin: { selected: false, symbol: "   " },
      bracer: { selected: false, color: "   " },
      shoeTrees: false,
      discountCode: "",
      notes: "   "
    });

    const params = buildGoogleFormPayload(formValues);

    expect(params.get(ORDER_FORM_ENTRIES.fullName)).toBe("Anna Zielińska");
    expect(params.get(ORDER_FORM_ENTRIES.phoneNumber)).toBe("+48111222333");
    expect(params.get(ORDER_FORM_ENTRIES.parcelLockerCode)).toBe("WAW321");
    expect(params.get(ORDER_FORM_ENTRIES.email)).toBe("anna@example.com");
    expect(params.get(ORDER_FORM_ENTRIES.footLength)).toBe("27,25");
    expect(params.get(ORDER_FORM_ENTRIES.instepCircumference)).toBe("23,5");
    expect(params.get(ORDER_FORM_ENTRIES.calfCircumference)).toBeNull();
    expect(params.getAll(ORDER_FORM_ENTRIES.waterskin)).toHaveLength(0);
    expect(params.getAll(ORDER_FORM_ENTRIES.bracer)).toHaveLength(0);
    expect(params.get(ORDER_FORM_ENTRIES.shoeTrees)).toBeNull();
    expect(params.get(ORDER_FORM_ENTRIES.discountCode)).toBeNull();
    expect(params.get(ORDER_FORM_ENTRIES.notes)).toBeNull();
  });

  it("wysyła zakodowany payload do Google Forms", async () => {
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
      size: ORDER_SIZES[0].id,
      accessories: [],
      waterskin: { selected: false },
      bracer: { selected: false },
      shoeTrees: false,
      discountCode: undefined,
      notes: undefined
    });

    const expectedPayload = buildGoogleFormPayload(formValues);
    const fetchSpy = vi.fn(async () => new Response(null, { status: 302 }));
    vi.stubGlobal("fetch", fetchSpy as unknown as typeof fetch);

    const response = await submitOrderToGoogle(formValues);

    expect(fetchSpy).toHaveBeenCalledWith(
      GOOGLE_FORM_CONSTANTS.actionUrl,
      expect.objectContaining({
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: expectedPayload.toString(),
        redirect: "manual"
      })
    );
    expect(response.status).toBe(302);
  });
});
