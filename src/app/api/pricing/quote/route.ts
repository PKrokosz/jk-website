import { NextRequest, NextResponse } from "next/server";
import { calculateQuote } from "@/lib/pricing/calc";
import type { PricingRequest } from "@/lib/pricing/calc";

export async function POST(request: NextRequest) {
  const payload = ((await request.json().catch(() => ({}))) ?? {}) as PricingRequest;
  const quote = calculateQuote(payload);

  return NextResponse.json({
    ok: true,
    requestedAt: new Date().toISOString(),
    payload,
    quote
  });
}
