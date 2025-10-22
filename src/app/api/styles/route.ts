import { NextResponse } from "next/server";

import { findActiveStyles } from "@/lib/catalog/repository";

export async function GET() {
  try {
    const styles = await findActiveStyles();
    return NextResponse.json({ data: styles });
  } catch (error) {
    console.error("Nie udało się pobrać listy stylów", error);
    return NextResponse.json({ error: "Nie udało się pobrać listy stylów" }, { status: 500 });
  }
}
