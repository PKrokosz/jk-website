import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { createMockProducts, getProductBySlug } from "@/lib/catalog/products";
import { findActiveLeathers, findActiveStyles } from "@/lib/catalog/repository";
import {
  catalogProductDetailResponseSchema,
  catalogProductListResponseSchema
} from "@/lib/catalog/schemas";

const querySchema = z
  .object({
    slug: z
      .string()
      .trim()
      .min(1, "Slug nie może być pusty")
      .optional()
  })
  .strict();

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const queryEntries = Object.fromEntries(url.searchParams.entries());
  const parsedQuery = querySchema.safeParse(queryEntries);

  if (!parsedQuery.success) {
    return NextResponse.json(
      { error: "Invalid query", issues: parsedQuery.error.issues },
      { status: 422 }
    );
  }

  try {
    const [styles, leathers] = await Promise.all([findActiveStyles(), findActiveLeathers()]);

    if (parsedQuery.data.slug) {
      const product = getProductBySlug(parsedQuery.data.slug, styles, leathers);

      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      const payload = catalogProductDetailResponseSchema.parse({ data: product });
      return NextResponse.json(payload);
    }

    const products = createMockProducts(styles, leathers);
    const payload = catalogProductListResponseSchema.parse({ data: products });

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Nie udało się pobrać listy produktów", error);
    return NextResponse.json(
      { error: "Nie udało się pobrać listy produktów" },
      { status: 500 }
    );
  }
}
