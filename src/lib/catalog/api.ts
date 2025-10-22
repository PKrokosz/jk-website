import "server-only";

import { resolveCatalogCache } from "@/lib/catalog/cache";
import { resolveApiUrl } from "@/lib/http/base-url";
import type {
  CatalogLeather,
  CatalogProductDetail,
  CatalogProductSummary,
  CatalogStyle
} from "@/lib/catalog/types";

export class CatalogApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly path: string,
    message: string
  ) {
    super(message);
    this.name = "CatalogApiError";
  }
}

interface ApiResponse<T> {
  data: T;
}

const NEXT_PHASE_PRODUCTION_BUILD = "phase-production-build";

function shouldMockCatalogFetch(): boolean {
  return (
    process.env.MOCK_CATALOG_FETCH === "1" ||
    process.env.NEXT_PHASE === NEXT_PHASE_PRODUCTION_BUILD
  );
}

let hasLoggedMockNotice = false;

async function mockCatalogResource<T>(path: string): Promise<T> {
  const cache = await resolveCatalogCache();

  if (!hasLoggedMockNotice) {
    console.info(
      "Mockujemy fetch katalogu (build-time) — zwracamy dane z cache w pamięci"
    );
    hasLoggedMockNotice = true;
  }

  if (path === "/api/styles") {
    return cache.styles as T;
  }

  if (path === "/api/leather") {
    return cache.leathers as T;
  }

  if (path === "/api/products") {
    return cache.summaries as T;
  }

  if (path.startsWith("/api/products/")) {
    const slug = decodeURIComponent(path.replace("/api/products/", ""));
    const detail = cache.detailsBySlug[slug];

    if (!detail) {
      throw new CatalogApiError(404, path, `Nie znaleziono produktu: ${slug}`);
    }

    return detail as T;
  }

  throw new Error(`Mock fetch nie obsługuje ścieżki: ${path}`);
}

async function fetchCatalogResource<T>(path: string): Promise<T> {
  if (shouldMockCatalogFetch()) {
    return mockCatalogResource<T>(path);
  }

  const response = await fetch(resolveApiUrl(path), {
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    throw new CatalogApiError(
      response.status,
      path,
      `Nie udało się pobrać zasobu API: ${path} (status ${response.status})`
    );
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
  const path = `/api/products/${encodeURIComponent(slug)}`;
  return fetchCatalogResource<CatalogProductDetail>(path);
}
