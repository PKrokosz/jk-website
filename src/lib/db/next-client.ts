import { createDbClient, type DbClient } from "@jk/db";

export class DatabaseConfigurationError extends Error {
  constructor(
    message = "Database connection string is not configured. Set the DATABASE_URL environment variable to continue."
  ) {
    super(message);
    this.name = "DatabaseConfigurationError";
  }
}

let cachedClient: DbClient | null = null;

export function getCachedNextDbClient(): DbClient | null {
  return cachedClient;
}

export function getNextDbClient(): DbClient {
  if (cachedClient) {
    return cachedClient;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new DatabaseConfigurationError();
  }

  cachedClient = createDbClient(connectionString);

  return cachedClient;
}

export function resetNextDbClient(): void {
  cachedClient = null;
}

export async function disposeNextDbClient(): Promise<void> {
  if (cachedClient) {
    await cachedClient.pool.end();
    cachedClient = null;
  }
}
