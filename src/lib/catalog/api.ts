import "server-only";

import { resolveApiUrl } from "@/lib/http/base-url";
import type {
  CatalogLeather,
  CatalogProductDetail,
  CatalogProductSummary,
  CatalogStyle
} from "@/lib/catalog/types";

interface ApiResponse<T> {
  data: T;
}

async function fetchCatalogResource<T>(path: string): Promise<T> {
  const response = await fetch(resolveApiUrl(path), {
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    throw new Error(`Nie udało się pobrać zasobu API: ${path}`);
  }

  const payload = (await response.json()) as ApiResponse<T>;
  return payload.data;
}

export function fetchCatalogStyles(): Promise<CatalogStyle[]> {
  return fetchCatalogResource<CatalogStyle[]>("/api/styles");
}

export function fetchCatalogLeathers(): Promise<CatalogLeather[]> {
  return fetchCatalogResource<CatalogLeather[]>("/api/leather");
}

export function fetchCatalogProducts(): Promise<CatalogProductSummary[]> {
  return fetchCatalogResource<CatalogProductSummary[]>("/api/products");
}

export function fetchCatalogProductDetail(slug: string): Promise<CatalogProductDetail> {
  const path = `/api/products?slug=${encodeURIComponent(slug)}`;
  return fetchCatalogResource<CatalogProductDetail>(path);
}
