import { NextRequest, NextResponse } from "next/server";
import { calculateQuote } from "@/lib/pricing/calc";
import {
  countQuoteRequestsSince,
  insertQuoteRequestLog
} from "@/lib/pricing/quote-requests-repository";
import { pricingQuoteRequestSchema, pricingQuoteResponseSchema } from "@/lib/pricing/schemas";

const RATE_LIMIT_MAX_REQUESTS = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 godzina

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

  const ipAddress = getClientIp(request);
  const now = new Date();
  const rateLimitWindowStart = new Date(now.getTime() - RATE_LIMIT_WINDOW_MS);

  const recentRequestCount = await countQuoteRequestsSince(
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
    await insertQuoteRequestLog({
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
