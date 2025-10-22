import { NextResponse } from "next/server";

import { resolveCatalogCache } from "@/lib/catalog/cache";
import { DatabaseConfigurationError, getNextDbClient } from "@/lib/db/next-client";

export async function GET() {
  let database: import("@jk/db").Database | undefined;

  try {
    database = getNextDbClient().db;
  } catch (error) {
    if (error instanceof DatabaseConfigurationError) {
      console.warn(
        "Baza danych katalogu nie jest skonfigurowana — korzystamy z danych referencyjnych",
        error
      );
    } else {
      console.error("Failed to initialize database client", error);

      return NextResponse.json(
        { error: "Unable to connect to the database. Please try again later." },
        { status: 500 }
      );
    }
  }

  try {
    const cache = await resolveCatalogCache(database);
    return NextResponse.json({ data: cache.leathers });
  } catch (error) {
    console.error("Nie udało się pobrać listy skór", error);
    return NextResponse.json({ error: "Nie udało się pobrać listy skór" }, { status: 500 });
  }
}
