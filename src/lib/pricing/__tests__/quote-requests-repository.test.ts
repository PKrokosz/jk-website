import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { countQuoteRequestsSince, insertQuoteRequestLog } from "../quote-requests-repository";
import type { PricingQuote, PricingQuoteRequest } from "../schemas";

const { selectMock, insertMock, queryBuilder, valuesMock, andMock, eqMock, gteMock, descMock } = vi.hoisted(() => {
  const selectMock = vi.fn();
  const insertMock = vi.fn();
  const queryBuilder = {
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn()
  } as {
    from: ReturnType<typeof vi.fn>;
    where: ReturnType<typeof vi.fn>;
    orderBy: ReturnType<typeof vi.fn>;
    limit: ReturnType<typeof vi.fn>;
  };
  const valuesMock = vi.fn();

  return {
    selectMock,
    insertMock,
    queryBuilder,
    valuesMock,
    andMock: vi.fn((...conditions: unknown[]) => conditions),
    eqMock: vi.fn((...args: unknown[]) => args),
    gteMock: vi.fn((...args: unknown[]) => args),
    descMock: vi.fn((value: unknown) => value)
  };
});

vi.mock("@jk/db", () => ({
  db: {
    select: selectMock,
    insert: insertMock
  },
  quoteRequest: {
    id: Symbol("id"),
    ipAddress: Symbol("ipAddress"),
    requestedAt: Symbol("requestedAt")
  },
  and: andMock,
  eq: eqMock,
  gte: gteMock,
  desc: descMock
}));

describe("quote-requests-repository", () => {
  const baseRequest: PricingQuoteRequest = {
    modelId: "model-1",
    options: []
  };
  const baseQuote: PricingQuote = {
    totalNetGrosz: 100_00,
    totalVatGrosz: 23_00,
    totalGrossGrosz: 123_00,
    breakdown: [{ label: "Model", amountGrosz: 100_00 }]
  };

  beforeEach(() => {
    selectMock.mockReset();
    insertMock.mockReset();
    valuesMock.mockReset();
    andMock.mockReset();
    eqMock.mockReset();
    gteMock.mockReset();
    descMock.mockReset();
    Object.assign(queryBuilder, {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      limit: vi.fn()
    });
    selectMock.mockReturnValue(queryBuilder);
    insertMock.mockReturnValue({ values: valuesMock });
    queryBuilder.limit.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    valuesMock.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns number of quote requests observed within the time window", async () => {
    const since = new Date("2024-10-01T10:00:00Z");
    const count = await countQuoteRequestsSince("127.0.0.1", since, 5);

    expect(count).toBe(2);
    expect(queryBuilder.limit).toHaveBeenCalledWith(5);
    expect(selectMock).toHaveBeenCalledWith({ id: expect.anything() });
  });

  it("returns zero when no matching rows exist", async () => {
    queryBuilder.limit.mockResolvedValueOnce([]);

    const count = await countQuoteRequestsSince("192.168.0.1", new Date(), 10);

    expect(count).toBe(0);
  });

  it("persists quote request log with sanitized values", async () => {
    const requestedAt = new Date("2024-11-20T12:00:00Z");

    await insertQuoteRequestLog({
      ipAddress: "192.168.1.1",
      userAgent: "Vitest",
      payload: baseRequest,
      quote: baseQuote,
      requestedAt
    });

    expect(insertMock).toHaveBeenCalled();
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
      insertQuoteRequestLog({
        ipAddress: "10.0.0.2",
        userAgent: null,
        payload: baseRequest,
        quote: baseQuote,
        requestedAt: new Date()
      })
    ).rejects.toThrow(error);
  });
});
