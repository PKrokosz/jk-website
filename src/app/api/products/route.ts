import { NextRequest, NextResponse } from "next/server";

import { resolveCatalogCache } from "@/lib/catalog/cache";
import { DatabaseConfigurationError, getNextDbClient } from "@/lib/db/next-client";
import { catalogProductListResponseSchema } from "@/lib/catalog/schemas";

export async function GET(_request: NextRequest) {
  let database: import("@jk/db").Database | undefined;

  try {
    database = getNextDbClient().db;
  } catch (error) {
    if (error instanceof DatabaseConfigurationError) {
      console.warn(
        "Database connection is not configured. Falling back to reference catalog data.",
        error
      );
    } else {
      console.error("Failed to initialize database client", error);
    }

    database = undefined;
  }

  try {
    const cache = await resolveCatalogCache(database);
    const payload = catalogProductListResponseSchema.parse({ data: cache.summaries });
    return NextResponse.json(payload);
  } catch (error) {
    console.error("Nie udało się pobrać listy produktów", error);
    return NextResponse.json(
      { error: "Nie udało się pobrać listy produktów" },
      { status: 500 }
    );
  }
}
