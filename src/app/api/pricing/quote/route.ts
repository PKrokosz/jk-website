import { NextRequest, NextResponse } from "next/server";
import { calculateQuote } from "@/lib/pricing/calc";
import { pricingQuoteRequestSchema, pricingQuoteResponseSchema } from "@/lib/pricing/schemas";

export async function POST(request: NextRequest) {
  const rawPayload = (await request.json().catch(() => ({}))) ?? {};
  const parsedPayload = pricingQuoteRequestSchema.safeParse(rawPayload);

  if (!parsedPayload.success) {
    return NextResponse.json(
      { error: "Invalid request payload", issues: parsedPayload.error.issues },
      { status: 422 }
    );
  }

  const quote = calculateQuote(parsedPayload.data);

  const responsePayload = pricingQuoteResponseSchema.parse({
    ok: true,
    requestedAt: new Date().toISOString(),
    payload: parsedPayload.data,
    quote
  });

  return NextResponse.json(responsePayload);
}
