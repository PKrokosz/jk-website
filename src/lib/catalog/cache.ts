import type { Database } from "@jk/db";

import {
  createProductDetailFromTemplate,
  createProductsFromTemplates,
  type ProductTemplate
} from "./products";
import {
  loadCatalogLeathers,
  loadCatalogProductTemplates,
  loadCatalogStyles,
  type RepositoryResult
} from "./repository";
import type {
  CatalogLeather,
  CatalogProductDetail,
  CatalogProductSummary,
  CatalogStyle
} from "./types";

const DEFAULT_TTL_MS = 5 * 60 * 1000;

interface CatalogCacheValue {
  styles: CatalogStyle[];
  leathers: CatalogLeather[];
  templates: ProductTemplate[];
  summaries: CatalogProductSummary[];
  detailsBySlug: Record<string, CatalogProductDetail>;
  sources: {
    styles: RepositoryResult<CatalogStyle[]>["source"];
    leathers: RepositoryResult<CatalogLeather[]>["source"];
    templates: RepositoryResult<ProductTemplate[]>["source"];
  };
  generatedAt: number;
}

interface CatalogCacheEntry {
  value: CatalogCacheValue | null;
  lastUpdated: number | null;
  expiresAt: number | null;
  hits: number;
  misses: number;
  fallbackCount: number;
  errorCount: number;
  lastError?: string;
  lastSources?: CatalogCacheValue["sources"];
  ttlMs: number;
}

interface CatalogCacheOptions {
  forceRefresh?: boolean;
  ttlMs?: number;
}

export interface CatalogCacheSnapshot {
  lastUpdatedAt: number | null;
  expiresAt: number | null;
  hits: number;
  misses: number;
  fallbackCount: number;
  errorCount: number;
  lastError?: string;
  sources?: CatalogCacheValue["sources"];
  stale: boolean;
}

type GlobalCatalogCache = {
  entry: CatalogCacheEntry;
};

const GLOBAL_CACHE_KEY = "__jk_catalog_cache";

type GlobalWithCatalog = typeof globalThis & {
  [GLOBAL_CACHE_KEY]?: GlobalCatalogCache;
};

function getGlobalCache(): GlobalCatalogCache {
  const globalRef = globalThis as GlobalWithCatalog;

  if (!globalRef[GLOBAL_CACHE_KEY]) {
    globalRef[GLOBAL_CACHE_KEY] = {
      entry: {
        value: null,
        lastUpdated: null,
        expiresAt: null,
        hits: 0,
        misses: 0,
        fallbackCount: 0,
        errorCount: 0,
        ttlMs: DEFAULT_TTL_MS
      }
    } satisfies GlobalCatalogCache;
  }

  return globalRef[GLOBAL_CACHE_KEY] as GlobalCatalogCache;
}

async function fetchCatalogData(database?: Database): Promise<CatalogCacheValue> {
  const [stylesResult, leathersResult, templatesResult] = await Promise.all([
    loadCatalogStyles(database),
    loadCatalogLeathers(database),
    loadCatalogProductTemplates(database)
  ]);

  const summaries = createProductsFromTemplates(
    templatesResult.data,
    stylesResult.data,
    leathersResult.data
  );

  const detailsEntries = templatesResult.data.map((template) => {
    const detail = createProductDetailFromTemplate(
      template,
      stylesResult.data,
      leathersResult.data
    );
    return [detail.slug, detail] as const;
  });

  const detailsBySlug = Object.fromEntries(detailsEntries);

  return {
    styles: stylesResult.data,
    leathers: leathersResult.data,
    templates: templatesResult.data,
    summaries,
    detailsBySlug,
    sources: {
      styles: stylesResult.source,
      leathers: leathersResult.source,
      templates: templatesResult.source
    },
    generatedAt: Date.now()
  } satisfies CatalogCacheValue;
}

function shouldRefresh(entry: CatalogCacheEntry, ttlMs: number, force?: boolean) {
  if (force) {
    return true;
  }

  if (!entry.value) {
    return true;
  }

  if (!entry.expiresAt) {
    return true;
  }

  return Date.now() >= entry.expiresAt;
}

export async function resolveCatalogCache(
  database?: Database,
  options: CatalogCacheOptions = {}
): Promise<CatalogCacheValue> {
  const cache = getGlobalCache();
  const entry = cache.entry;
  const ttlMs = options.ttlMs ?? entry.ttlMs ?? DEFAULT_TTL_MS;

  if (!shouldRefresh(entry, ttlMs, options.forceRefresh)) {
    entry.hits += 1;
    return entry.value as CatalogCacheValue;
  }

  entry.misses += 1;
  entry.ttlMs = ttlMs;

  try {
    const value = await fetchCatalogData(database);
    entry.value = value;
    entry.lastUpdated = value.generatedAt;
    entry.expiresAt = value.generatedAt + ttlMs;
    entry.lastError = undefined;
    entry.lastSources = value.sources;
    entry.fallbackCount += Object.values(value.sources).filter(
      (source) => source === "fallback"
    ).length;
    return value;
  } catch (error) {
    entry.errorCount += 1;
    entry.lastError = error instanceof Error ? error.message : String(error);

    if (entry.value) {
      return entry.value;
    }

    throw error;
  }
}

export async function refreshCatalogCache(
  database?: Database,
  options: CatalogCacheOptions = {}
): Promise<CatalogCacheValue> {
  return resolveCatalogCache(database, { ...options, forceRefresh: true });
}

export function getCatalogCacheSnapshot(): CatalogCacheSnapshot {
  const { entry } = getGlobalCache();
  const now = Date.now();
  const expiresAt = entry.expiresAt;
  const stale = typeof expiresAt === "number" ? now >= expiresAt : true;

  return {
    lastUpdatedAt: entry.lastUpdated,
    expiresAt,
    hits: entry.hits,
    misses: entry.misses,
    fallbackCount: entry.fallbackCount,
    errorCount: entry.errorCount,
    lastError: entry.lastError,
    sources: entry.lastSources,
    stale
  } satisfies CatalogCacheSnapshot;
}
