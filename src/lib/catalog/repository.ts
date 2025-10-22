import { catalogLeathers, catalogStyles } from "./data";
import { mapLeatherRowToCatalogLeather, mapStyleRowToCatalogStyle } from "./mappers";
import type { CatalogLeather, CatalogStyle } from "./types";

type DbModule = typeof import("@jk/db");

async function loadDbModule(): Promise<DbModule | null> {
  try {
    return await import("@jk/db");
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

export async function findActiveStyles(): Promise<CatalogStyle[]> {
  const dbModule = await loadDbModule();

  if (!dbModule) {
    return getFallbackStyles();
  }

  try {
    const rows = await dbModule.db.select().from(dbModule.style);

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

export async function findActiveLeathers(): Promise<CatalogLeather[]> {
  const dbModule = await loadDbModule();

  if (!dbModule) {
    return getFallbackLeathers();
  }

  try {
    const rows = await dbModule.db.select().from(dbModule.leather);

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
