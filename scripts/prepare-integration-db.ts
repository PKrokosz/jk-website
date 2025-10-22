import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { setTimeout as delay } from "node:timers/promises";
import { resolve } from "node:path";

import { config as loadEnv } from "dotenv";

interface RunCommandOptions {
  env?: NodeJS.ProcessEnv;
}

async function runCommand(
  command: string,
  args: string[],
  { env }: RunCommandOptions = {}
): Promise<void> {
  await new Promise<void>((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      env: env ? { ...process.env, ...env } : process.env
    });

    child.on("error", (error) => {
      rejectPromise(error);
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolvePromise();
        return;
      }

      rejectPromise(
        new Error(
          `Command \"${command} ${args.join(" ")}\" exited with code ${code ?? "null"}.`
        )
      );
    });
  });
}

async function ensureDatabaseIsReady(): Promise<void> {
  const maxAttempts = 30;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await runCommand("docker", [
        "compose",
        "exec",
        "-T",
        "jkdb",
        "pg_isready",
        "-U",
        "postgres"
      ]);
      return;
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }

      console.info(`Waiting for database... (${attempt}/${maxAttempts})`);
      await delay(2000);
    }
  }
}

async function loadTestEnvironment(): Promise<NodeJS.ProcessEnv> {
  const envPath = resolve(process.cwd(), ".env.test");

  if (!existsSync(envPath)) {
    throw new Error(
      "Missing .env.test file. Create it (or copy from .env.test.example) before running integration tests."
    );
  }

  const result = loadEnv({ path: envPath, override: true });

  if (result.error) {
    throw result.error;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be defined in .env.test before running migrations or seeds."
    );
  }

  return { ...process.env };
}

async function main(): Promise<void> {
  console.info("🚀 Starting jkdb container (docker compose up -d jkdb)...");
  await runCommand("docker", ["compose", "up", "-d", "jkdb"]);

  console.info("⏳ Waiting for jkdb to accept connections...");
  await ensureDatabaseIsReady();

  console.info("📄 Loading .env.test configuration...");
  const env = await loadTestEnvironment();

  console.info("📦 Applying migrations (pnpm db:migrate)...");
  await runCommand("pnpm", ["db:migrate"], { env });

  console.info("🌱 Seeding database (pnpm db:seed)...");
  await runCommand("pnpm", ["db:seed"], { env });

  console.info("✅ Integration database is ready for tests.");
}

void main().catch((error) => {
  console.error("❌ Failed to prepare integration database.", error);
  process.exitCode = 1;
});
