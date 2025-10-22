import { and, desc, eq, gte, quoteRequest, type Database } from "@jk/db";

import type { PricingQuote, PricingQuoteRequest } from "./schemas";

export async function countQuoteRequestsSince(
  database: Database,
  ipAddress: string,
  since: Date,
  limit: number
): Promise<number> {
  const rows = await database
    .select({ id: quoteRequest.id })
    .from(quoteRequest)
    .where(
      and(eq(quoteRequest.ipAddress, ipAddress), gte(quoteRequest.requestedAt, since))
    )
    .orderBy(desc(quoteRequest.requestedAt))
    .limit(limit);

  return rows.length;
}

export async function insertQuoteRequestLog(
  database: Database,
  args: {
    ipAddress: string;
    userAgent?: string | null;
    payload: PricingQuoteRequest;
    quote: PricingQuote;
    requestedAt: Date;
  }
): Promise<void> {
  const { ipAddress, userAgent, payload, quote, requestedAt } = args;

  await database.insert(quoteRequest).values({
    ipAddress,
    userAgent: userAgent ?? null,
    payload,
    quote,
    requestedAt
  });
}
