import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Pool as PgPool } from "pg";
import pg from "pg";

const { Pool } = pg;

import * as schema from "../schema";

export type Database = NodePgDatabase<typeof schema>;

export interface DbClient {
  db: Database;
  pool: PgPool;
}

export function createDbClient(connectionString: string): DbClient {
  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { schema });

  return { db, pool };
}
