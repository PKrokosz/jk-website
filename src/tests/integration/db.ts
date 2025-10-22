import path from "node:path";

import { config as loadEnv } from "dotenv";

import { createDbClient, type DbClient } from "@jk/db";
import {
  disposeNextDbClient,
  getCachedNextDbClient,
  resetNextDbClient
} from "@/lib/db/next-client";

let envLoaded = false;
let integrationClient: DbClient | null = null;
let migrationsApplied = false;

type MigratorModule = typeof import("drizzle-orm/node-postgres/migrator");

let cachedMigrate: MigratorModule["migrate"] | null = null;

async function loadMigrator(): Promise<MigratorModule["migrate"]> {
  if (!cachedMigrate) {
    const module: MigratorModule = await import(
      "drizzle-orm/node-postgres/migrator"
    );
    cachedMigrate = module.migrate;
  }

  return cachedMigrate;
}

export function loadIntegrationTestEnv(): void {
  if (envLoaded) {
    return;
  }

  loadEnv({ path: ".env.test" });
  envLoaded = true;

  if (!process.env.DATABASE_URL) {
    throw new Error(
      "Integration tests require DATABASE_URL to be defined in .env.test."
    );
  }
}

export function getIntegrationTestClient(): DbClient {
  loadIntegrationTestEnv();

  if (!integrationClient) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL must be defined for integration tests.");
    }

    integrationClient = createDbClient(connectionString);
  }

  return integrationClient;
}

export async function ensureIntegrationTestMigrations(): Promise<void> {
  loadIntegrationTestEnv();

  if (migrationsApplied) {
    return;
  }

  const client = getIntegrationTestClient();
  const migrationsFolder = path.resolve(process.cwd(), "drizzle");
  const migrate = await loadMigrator();

  await migrate(client.db, { migrationsFolder });

  migrationsApplied = true;
}

export async function closeIntegrationTestClient(): Promise<void> {
  if (integrationClient) {
    await integrationClient.pool.end();
    integrationClient = null;
  }
}

export async function resetCachedNextDbClient(): Promise<void> {
  const cached = getCachedNextDbClient();
  if (cached) {
    await disposeNextDbClient();
    return;
  }

  resetNextDbClient();
}
