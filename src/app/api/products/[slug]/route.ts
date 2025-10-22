import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { resolveCatalogCache } from "@/lib/catalog/cache";
import { DatabaseConfigurationError, getNextDbClient } from "@/lib/db/next-client";
import { catalogProductDetailResponseSchema } from "@/lib/catalog/schemas";

const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug nie może być pusty");

export async function GET(
  _request: NextRequest,
  context: { params: { slug?: string } }
) {
  const parsedSlug = slugSchema.safeParse(context.params?.slug ?? "");

  if (!parsedSlug.success) {
    return NextResponse.json(
      { error: "Invalid slug", issues: parsedSlug.error.issues },
      { status: 422 }
    );
  }

  let database: import("@jk/db").Database;

  try {
    database = getNextDbClient().db;
  } catch (error) {
    console.error("Failed to initialize database client", error);

    if (error instanceof DatabaseConfigurationError) {
      return NextResponse.json(
        {
          error: "Database connection is not configured. Please try again later."
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Unable to connect to the database. Please try again later." },
      { status: 500 }
    );
  }

  try {
    const cache = await resolveCatalogCache(database);
    const detail = cache.detailsBySlug[parsedSlug.data];

    if (!detail) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const payload = catalogProductDetailResponseSchema.parse({ data: detail });
    return NextResponse.json(payload);
  } catch (error) {
    console.error("Nie udało się pobrać szczegółów produktu", error);
    return NextResponse.json(
      { error: "Nie udało się pobrać szczegółów produktu" },
      { status: 500 }
    );
  }
}
