import { and, desc, eq, gte, db, quoteRequest } from "@jk/db";

import type { PricingQuote, PricingQuoteRequest } from "./schemas";

export async function countQuoteRequestsSince(
  ipAddress: string,
  since: Date,
  limit: number
): Promise<number> {
  const rows = await db
    .select({ id: quoteRequest.id })
    .from(quoteRequest)
    .where(
      and(eq(quoteRequest.ipAddress, ipAddress), gte(quoteRequest.requestedAt, since))
    )
    .orderBy(desc(quoteRequest.requestedAt))
    .limit(limit);

  return rows.length;
}

export async function insertQuoteRequestLog(args: {
  ipAddress: string;
  userAgent?: string | null;
  payload: PricingQuoteRequest;
  quote: PricingQuote;
  requestedAt: Date;
}): Promise<void> {
  const { ipAddress, userAgent, payload, quote, requestedAt } = args;

  await db.insert(quoteRequest).values({
    ipAddress,
    userAgent: userAgent ?? null,
    payload,
    quote,
    requestedAt
  });
}
