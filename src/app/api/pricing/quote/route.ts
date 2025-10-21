import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  // TODO: tu podłączymy prawdziwy kalkulator; na razie stała kwota
  return NextResponse.json({ price: { net: 100000, gross: 123000, currency: "PLN" }, echo: body });
}
