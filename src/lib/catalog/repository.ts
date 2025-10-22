import { db } from "@jk/db";

import { mapLeatherRowToCatalogLeather, mapStyleRowToCatalogStyle } from "./mappers";
import type { CatalogLeather, CatalogStyle } from "./types";

export async function findActiveStyles(): Promise<CatalogStyle[]> {
  const rows = await db.select().from((await import("@jk/db")).style);

  return rows
    .filter((entry) => entry.active !== false)
    .sort((a, b) => a.id - b.id)
    .map(mapStyleRowToCatalogStyle);
}

export async function findActiveLeathers(): Promise<CatalogLeather[]> {
  const rows = await db.select().from((await import("@jk/db")).leather);

  return rows
    .filter((entry) => entry.active !== false)
    .sort((a, b) => a.id - b.id)
    .map(mapLeatherRowToCatalogLeather);
}
