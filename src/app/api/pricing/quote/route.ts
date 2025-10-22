import { NextRequest, NextResponse } from "next/server";

import { calculateQuote } from "@/lib/pricing/calc";
import {
  countQuoteRequestsSince,
  insertQuoteRequestLog
} from "@/lib/pricing/quote-requests-repository";
import { pricingQuoteRequestSchema, pricingQuoteResponseSchema } from "@/lib/pricing/schemas";
import { createDbClient, type Database, type DbClient } from "@jk/db";

const RATE_LIMIT_MAX_REQUESTS = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 godzina

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

let cachedDbClient: DbClient | null = null;

function getDatabase(connectionString: string): Database {
  if (!cachedDbClient) {
    cachedDbClient = createDbClient(connectionString);
  }

  return cachedDbClient.db;
}

function getClientIp(request: NextRequest): string {
  if (request.ip) {
    return request.ip;
  }

  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    const [first] = forwardedFor
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    if (first) {
      return first;
    }
  }

  return "unknown";
}

export async function POST(request: NextRequest) {
  const rawPayload = (await request.json().catch(() => ({}))) ?? {};
  const parsedPayload = pricingQuoteRequestSchema.safeParse(rawPayload);

  if (!parsedPayload.success) {
    return NextResponse.json(
      { error: "Invalid request payload", issues: parsedPayload.error.issues },
      { status: 422 }
    );
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return NextResponse.json(
      {
        ok: false,
        error: "Database connection is not configured. Please try again later."
      },
      { status: 500 }
    );
  }

  let database: Database;

  try {
    database = getDatabase(databaseUrl);
  } catch (error) {
    console.error("Failed to initialize database client", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to access database. Please try again later."
      },
      { status: 500 }
    );
  }

  const ipAddress = getClientIp(request);
  const now = new Date();
  const rateLimitWindowStart = new Date(now.getTime() - RATE_LIMIT_WINDOW_MS);

  const recentRequestCount = await countQuoteRequestsSince(
    database,
    ipAddress,
    rateLimitWindowStart,
    RATE_LIMIT_MAX_REQUESTS
  );

  if (recentRequestCount >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfterSeconds = Math.ceil(RATE_LIMIT_WINDOW_MS / 1000);

    return NextResponse.json(
      {
        ok: false,
        error: "Too many quote requests from this IP. Please try again later.",
        retryAfterSeconds
      },
      {
        status: 429,
        headers: { "Retry-After": `${retryAfterSeconds}` }
      }
    );
  }

  const quote = calculateQuote(parsedPayload.data);
  const requestedAtIso = now.toISOString();

  const responsePayload = pricingQuoteResponseSchema.parse({
    ok: true,
    requestedAt: requestedAtIso,
    payload: parsedPayload.data,
    quote
  });

  try {
    await insertQuoteRequestLog(database, {
      ipAddress,
      userAgent: request.headers.get("user-agent"),
      payload: responsePayload.payload,
      quote: responsePayload.quote,
      requestedAt: now
    });
  } catch (error) {
    console.error("Failed to persist quote request", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to process quote request at this time."
      },
      { status: 500 }
    );
  }

  return NextResponse.json(responsePayload);
}
