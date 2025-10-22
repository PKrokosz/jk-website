import { NextResponse } from "next/server";

import { findActiveLeathers } from "@/lib/catalog/repository";
import { DatabaseConfigurationError, getNextDbClient } from "@/lib/db/next-client";

export async function GET() {
  let database: import("@jk/db").Database;

  try {
    database = getNextDbClient().db;
  } catch (error) {
    console.error("Failed to initialize database client", error);

    if (error instanceof DatabaseConfigurationError) {
      return NextResponse.json(
        { error: "Database connection is not configured. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Unable to connect to the database. Please try again later." },
      { status: 500 }
    );
  }

  try {
    const leathers = await findActiveLeathers(database);
    return NextResponse.json({ data: leathers });
  } catch (error) {
    console.error("Nie udało się pobrać listy skór", error);
    return NextResponse.json({ error: "Nie udało się pobrać listy skór" }, { status: 500 });
  }
}
