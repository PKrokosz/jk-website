import { beforeEach, describe, expect, it, vi } from "vitest";

import { orderFormSchema } from "@/lib/order/schema";

const mockSubmit = vi.fn();

vi.mock("@/lib/order/googleForm", () => ({
  submitOrderToGoogle: mockSubmit
}));

describe("POST /api/order/submit", () => {
  beforeEach(() => {
    mockSubmit.mockReset();
  });

  it("returns 400 when payload is not valid JSON", async () => {
    const { POST } = await import("../route");
    const response = await POST(new Request("http://localhost/api/order/submit", { method: "POST", body: "not-json" }));
    expect(response.status).toBe(400);
  });

  it("returns 422 for invalid payload", async () => {
    const { POST } = await import("../route");
    const response = await POST(
      new Request("http://localhost/api/order/submit", {
        method: "POST",
        body: JSON.stringify({})
      })
    );
    expect(response.status).toBe(422);
  });

  it("forwards valid payload to Google Forms proxy", async () => {
    mockSubmit.mockResolvedValue(new Response(null, { status: 200 }));
    const { POST } = await import("../route");

    const validPayload = orderFormSchema.parse({
      fullName: "Jan Kowalski",
      phoneNumber: "+48123456789",
      parcelLockerCode: "WAW123",
      email: "jan@example.com",
      footLength: "27",
      instepCircumference: "24",
      calfCircumference: "",
      modelId: "szpic",
      color: "brown",
      size: "42",
      accessories: [],
      waterskin: { selected: false, symbol: "" },
      bracer: { selected: false, color: "" },
      shoeTrees: false,
      discountCode: "",
      notes: ""
    });

    const response = await POST(
      new Request("http://localhost/api/order/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(validPayload)
      })
    );

    expect(mockSubmit).toHaveBeenCalledWith(validPayload);
    expect(response.status).toBe(200);
  });

  it("handles upstream failure", async () => {
    mockSubmit.mockResolvedValue(new Response(null, { status: 500 }));
    const { POST } = await import("../route");

    const validPayload = orderFormSchema.parse({
      fullName: "Jan Kowalski",
      phoneNumber: "+48123456789",
      parcelLockerCode: "WAW123",
      email: "jan@example.com",
      footLength: "27",
      instepCircumference: "24",
      calfCircumference: "",
      modelId: "szpic",
      color: "brown",
      size: "42",
      accessories: [],
      waterskin: { selected: false, symbol: "" },
      bracer: { selected: false, color: "" },
      shoeTrees: false,
      discountCode: "",
      notes: ""
    });

    const response = await POST(
      new Request("http://localhost/api/order/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(validPayload)
      })
    );

    expect(response.status).toBe(502);
  });
});
