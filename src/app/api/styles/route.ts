import { NextResponse } from "next/server";

import { catalogStyles } from "@/lib/catalog/data";

export function GET() {
  return NextResponse.json({ data: catalogStyles });
}
