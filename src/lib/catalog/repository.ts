import type { Database } from "@jk/db";

import { catalogLeathers, catalogStyles } from "./data";
import { mapLeatherRowToCatalogLeather, mapStyleRowToCatalogStyle } from "./mappers";
import {
  getFallbackProductTemplates,
  mapProductTemplateRow,
  type ProductTemplate
} from "./products";
import type { CatalogLeather, CatalogStyle } from "./types";

type DbModule = Pick<typeof import("@jk/db"), "style" | "leather" | "productTemplate">;

export interface RepositoryResult<T> {
  data: T;
  source: "database" | "fallback";
  error?: unknown;
}

let cachedDbModule: DbModule | null = null;

async function loadDbModule(): Promise<DbModule | null> {
  if (cachedDbModule) {
    return cachedDbModule;
  }

  try {
    const importedDbModule = await import("@jk/db");
    const { style, leather } = importedDbModule;

    cachedDbModule = {
      style: module.style,
      leather: module.leather,
      productTemplate: module.productTemplate
    };
    return cachedDbModule;
  } catch (error) {
    console.warn(
      "Baza danych katalogu jest niedostępna — korzystamy z danych referencyjnych",
      error
    );
    return null;
  }
}

export const __catalogRepositoryInternals = {
  loadDbModule,
  getCachedDbModule(): DbModule | null {
    return cachedDbModule;
  },
  resetDbModuleCache(): void {
    cachedDbModule = null;
  }
};

function getFallbackStyles(): CatalogStyle[] {
  return [...catalogStyles].sort((a, b) => a.id - b.id);
}

function getFallbackLeathers(): CatalogLeather[] {
  return [...catalogLeathers].sort((a, b) => a.id - b.id);
}

function getFallbackProductTemplateRecords(): ProductTemplate[] {
  return getFallbackProductTemplates().sort((a, b) => a.slug.localeCompare(b.slug));
}

export async function loadCatalogStyles(
  database?: Database
): Promise<RepositoryResult<CatalogStyle[]>> {
  const dbModule = await loadDbModule();

  if (!database || !dbModule) {
    return { data: getFallbackStyles(), source: "fallback" };
  }

  try {
    const rows = await database.select().from(dbModule.style);

    return {
      data: rows
        .filter((entry) => entry.active !== false)
        .sort((a, b) => a.id - b.id)
        .map(mapStyleRowToCatalogStyle),
      source: "database"
    } satisfies RepositoryResult<CatalogStyle[]>;
  } catch (error) {
    console.warn(
      "Nie udało się pobrać stylów z bazy danych — korzystamy z danych referencyjnych",
      error
    );

    return {
      data: getFallbackStyles(),
      source: "fallback",
      error
    } satisfies RepositoryResult<CatalogStyle[]>;
  }
}

export async function loadCatalogLeathers(
  database?: Database
): Promise<RepositoryResult<CatalogLeather[]>> {
  const dbModule = await loadDbModule();

  if (!database || !dbModule) {
    return { data: getFallbackLeathers(), source: "fallback" };
  }

  try {
    const rows = await database.select().from(dbModule.leather);

    return {
      data: rows
        .filter((entry) => entry.active !== false)
        .sort((a, b) => a.id - b.id)
        .map(mapLeatherRowToCatalogLeather),
      source: "database"
    } satisfies RepositoryResult<CatalogLeather[]>;
  } catch (error) {
    console.warn(
      "Nie udało się pobrać skór z bazy danych — korzystamy z danych referencyjnych",
      error
    );

    return {
      data: getFallbackLeathers(),
      source: "fallback",
      error
    } satisfies RepositoryResult<CatalogLeather[]>;
  }
}

export async function loadCatalogProductTemplates(
  database?: Database
): Promise<RepositoryResult<ProductTemplate[]>> {
  const dbModule = await loadDbModule();

  if (!database || !dbModule) {
    return {
      data: getFallbackProductTemplateRecords(),
      source: "fallback"
    } satisfies RepositoryResult<ProductTemplate[]>;
  }

  try {
    const rows = await database.select().from(dbModule.productTemplate);

    return {
      data: rows.map(mapProductTemplateRow).sort((a, b) => a.slug.localeCompare(b.slug)),
      source: "database"
    } satisfies RepositoryResult<ProductTemplate[]>;
  } catch (error) {
    console.warn(
      "Nie udało się pobrać produktów z bazy danych — korzystamy z danych referencyjnych",
      error
    );

    return {
      data: getFallbackProductTemplateRecords(),
      source: "fallback",
      error
    } satisfies RepositoryResult<ProductTemplate[]>;
  }
}

export async function findActiveStyles(database?: Database): Promise<CatalogStyle[]> {
  const result = await loadCatalogStyles(database);
  return result.data;
}

export async function findActiveLeathers(database?: Database): Promise<CatalogLeather[]> {
  const result = await loadCatalogLeathers(database);
  return result.data;
}

export async function findProductTemplates(
  database?: Database
): Promise<ProductTemplate[]> {
  const result = await loadCatalogProductTemplates(database);
  return result.data;
}
