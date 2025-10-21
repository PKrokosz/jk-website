import { NextResponse } from "next/server";

import { catalogLeathers } from "@/lib/catalog/data";

export function GET() {
  return NextResponse.json({ data: catalogLeathers });
}
