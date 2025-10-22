import { NextResponse } from "next/server";

import { findActiveLeathers } from "@/lib/catalog/repository";

export async function GET() {
  try {
    const leathers = await findActiveLeathers();
    return NextResponse.json({ data: leathers });
  } catch (error) {
    console.error("Nie udało się pobrać listy skór", error);
    return NextResponse.json({ error: "Nie udało się pobrać listy skór" }, { status: 500 });
  }
}
