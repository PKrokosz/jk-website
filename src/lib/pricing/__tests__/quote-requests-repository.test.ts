import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { countQuoteRequestsSince, insertQuoteRequestLog } from "../quote-requests-repository";
import type { PricingQuote, PricingQuoteRequest } from "../schemas";
import { createMockPricingDatabase } from "./mock-db";

const { andMock, eqMock, gteMock, descMock, quoteRequestMock } = vi.hoisted(() => ({
  andMock: vi.fn((...conditions: unknown[]) => conditions),
  eqMock: vi.fn((...args: unknown[]) => args),
  gteMock: vi.fn((...args: unknown[]) => args),
  descMock: vi.fn((value: unknown) => value),
  quoteRequestMock: {
    id: Symbol("id"),
    ipAddress: Symbol("ipAddress"),
    requestedAt: Symbol("requestedAt")
  }
}));

vi.mock("@jk/db", () => ({
  quoteRequest: quoteRequestMock,
  and: andMock,
  eq: eqMock,
  gte: gteMock,
  desc: descMock
}));

describe("quote-requests-repository", () => {
  const baseRequest: PricingQuoteRequest = {
    styleId: 1,
    leatherId: 2,
    basePriceGrosz: 100_00,
    baseLabel: "Model testowy",
    options: []
  };
  const baseQuote: PricingQuote = {
    currency: "PLN",
    totalNetGrosz: 100_00,
    totalVatGrosz: 23_00,
    totalGrossGrosz: 123_00,
    breakdown: [{ label: "Model", amountGrosz: 100_00 }]
  };

  let db: ReturnType<typeof createMockPricingDatabase>["db"];
  let selectMock: ReturnType<typeof createMockPricingDatabase>["selectMock"];
  let insertMock: ReturnType<typeof createMockPricingDatabase>["insertMock"];
  let valuesMock: ReturnType<typeof createMockPricingDatabase>["valuesMock"];
  let queryBuilder: ReturnType<typeof createMockPricingDatabase>["queryBuilder"];

  beforeEach(() => {
    ({ db, selectMock, insertMock, valuesMock, queryBuilder } = createMockPricingDatabase());

    queryBuilder.limit.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    valuesMock.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns number of quote requests observed within the time window", async () => {
    const since = new Date("2024-10-01T10:00:00Z");
    const count = await countQuoteRequestsSince(db, "127.0.0.1", since, 5);

    expect(count).toBe(2);
    expect(queryBuilder.limit).toHaveBeenCalledWith(5);
    expect(selectMock).toHaveBeenCalledWith({ id: expect.anything() });
    expect(queryBuilder.from).toHaveBeenCalledWith(quoteRequestMock);
  });

  it("returns zero when no matching rows exist", async () => {
    queryBuilder.limit.mockResolvedValueOnce([]);

    const count = await countQuoteRequestsSince(db, "192.168.0.1", new Date(), 10);

    expect(count).toBe(0);
  });

  it("persists quote request log with sanitized values", async () => {
    const requestedAt = new Date("2024-11-20T12:00:00Z");

    await insertQuoteRequestLog(db, {
      ipAddress: "192.168.1.1",
      userAgent: "Vitest",
      payload: baseRequest,
      quote: baseQuote,
      requestedAt
    });

    expect(insertMock).toHaveBeenCalledWith(quoteRequestMock);
    expect(valuesMock).toHaveBeenCalledWith({
      ipAddress: "192.168.1.1",
      userAgent: "Vitest",
      payload: baseRequest,
      quote: baseQuote,
      requestedAt
    });
  });

  it("propagates errors from the database layer", async () => {
    const error = new Error("DB unavailable");
    valuesMock.mockRejectedValueOnce(error);

    await expect(
      insertQuoteRequestLog(db, {
        ipAddress: "10.0.0.2",
        userAgent: null,
        payload: baseRequest,
        quote: baseQuote,
        requestedAt: new Date()
      })
    ).rejects.toThrow(error);
  });
});
