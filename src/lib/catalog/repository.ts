import type { Database } from "@jk/db";

import { catalogLeathers, catalogStyles } from "./data";
import { mapLeatherRowToCatalogLeather, mapStyleRowToCatalogStyle } from "./mappers";
import type { CatalogLeather, CatalogStyle } from "./types";

type DbModule = Pick<typeof import("@jk/db"), "style" | "leather">;

let cachedDbModule: DbModule | null = null;

async function loadDbModule(): Promise<DbModule | null> {
  if (cachedDbModule) {
    return cachedDbModule;
  }

  try {
    const importedDbModule = await import("@jk/db");
    const { style, leather } = importedDbModule;

    cachedDbModule = {
      style,
      leather
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

function getFallbackStyles(): CatalogStyle[] {
  return [...catalogStyles].sort((a, b) => a.id - b.id);
}

function getFallbackLeathers(): CatalogLeather[] {
  return [...catalogLeathers].sort((a, b) => a.id - b.id);
}

export async function findActiveStyles(database?: Database): Promise<CatalogStyle[]> {
  const dbModule = await loadDbModule();

  if (!database || !dbModule) {
    return getFallbackStyles();
  }

  try {
    const rows = await database.select().from(dbModule.style);

    return rows
      .filter((entry) => entry.active !== false)
      .sort((a, b) => a.id - b.id)
      .map(mapStyleRowToCatalogStyle);
  } catch (error) {
    console.warn(
      "Nie udało się pobrać stylów z bazy danych — korzystamy z danych referencyjnych",
      error
    );
    return getFallbackStyles();
  }
}

export async function findActiveLeathers(database?: Database): Promise<CatalogLeather[]> {
  const dbModule = await loadDbModule();

  if (!database || !dbModule) {
    return getFallbackLeathers();
  }

  try {
    const rows = await database.select().from(dbModule.leather);

    return rows
      .filter((entry) => entry.active !== false)
      .sort((a, b) => a.id - b.id)
      .map(mapLeatherRowToCatalogLeather);
  } catch (error) {
    console.warn(
      "Nie udało się pobrać skór z bazy danych — korzystamy z danych referencyjnych",
      error
    );
    return getFallbackLeathers();
  }
}
