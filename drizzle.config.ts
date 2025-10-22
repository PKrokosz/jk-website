import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { config as loadEnv } from "dotenv";
import { defineConfig } from "drizzle-kit";

const envFiles = [".env.local", ".env"] as const;

for (const file of envFiles) {
  const fullPath = resolve(process.cwd(), file);

  if (existsSync(fullPath)) {
    loadEnv({ path: fullPath, override: true });
  }
}

if (!process.env.DATABASE_URL) {
  const exampleEnvPath = resolve(process.cwd(), ".env.example");

  if (existsSync(exampleEnvPath)) {
    loadEnv({ path: exampleEnvPath, override: false });
  }
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is required to run Drizzle Kit commands. Create a .env.local (or .env) file with DATABASE_URL set to your Postgres connection string. As a temporary fallback you can copy values from .env.example."
  );
}

export default defineConfig({
  schema: "./packages/db/src/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    connectionString
  }
});
