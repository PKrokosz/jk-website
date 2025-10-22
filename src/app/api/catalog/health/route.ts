import { NextRequest, NextResponse } from "next/server";

import { getCatalogCacheSnapshot, resolveCatalogCache } from "@/lib/catalog/cache";
import { DatabaseConfigurationError, getNextDbClient } from "@/lib/db/next-client";

export async function GET(_request: NextRequest) {
  let database: import("@jk/db").Database;

  try {
    database = getNextDbClient().db;
  } catch (error) {
    console.error("Failed to initialize database client", error);

    if (error instanceof DatabaseConfigurationError) {
      return NextResponse.json(
        {
          ok: false,
          status: "unavailable",
          error: "Database connection is not configured."
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { ok: false, status: "unavailable", error: "Unable to connect to the database." },
      { status: 500 }
    );
  }

  try {
    const cache = await resolveCatalogCache(database, { forceRefresh: true });
    const snapshot = getCatalogCacheSnapshot();
    const fallbackUsed = Object.values(cache.sources).some((source) => source === "fallback");

    return NextResponse.json({
      ok: true,
      status: fallbackUsed ? "degraded" : "healthy",
      generatedAt: new Date(cache.generatedAt).toISOString(),
      counts: {
        styles: cache.styles.length,
        leathers: cache.leathers.length,
        products: cache.summaries.length
      },
      sources: cache.sources,
      cache: snapshot
    });
  } catch (error) {
    console.error("Nie udało się odświeżyć cache katalogu", error);
    return NextResponse.json(
      { ok: false, status: "error", error: "Nie udało się odświeżyć cache katalogu" },
      { status: 500 }
    );
  }
}
