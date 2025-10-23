import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { DbClient } from "@jk/db";

const mocks = vi.hoisted(() => {
  let lastCreatedClient: { client: DbClient; poolEnd: ReturnType<typeof vi.fn> } | null = null;

  const createDbClient = vi.fn((connection: string) => {
    const poolEnd = vi.fn(async () => {});
    const client = {
      db: { connection, tag: "db" },
      pool: { end: poolEnd }
    } as unknown as DbClient;

    lastCreatedClient = { client, poolEnd };
    return client;
  });

  return {
    loadEnv: vi.fn(() => {
      process.env.DATABASE_URL =
        "postgres://integration_user:integration_pass@localhost:5432/jk_integration";
    }),
    createDbClient,
    getLastCreatedClient: () => lastCreatedClient,
    migrate: vi.fn(async () => {}),
    disposeNextDbClient: vi.fn(async () => {}),
    getCachedNextDbClient: vi.fn(() => null),
    resetNextDbClient: vi.fn()
  };
});

vi.mock("dotenv", () => ({
  config: mocks.loadEnv
}));

vi.mock("@jk/db", () => ({
  createDbClient: mocks.createDbClient
}));

vi.mock("@/lib/db/next-client", () => ({
  disposeNextDbClient: mocks.disposeNextDbClient,
  getCachedNextDbClient: mocks.getCachedNextDbClient,
  resetNextDbClient: mocks.resetNextDbClient
}));

vi.mock("drizzle-orm/node-postgres/migrator", () => ({
  migrate: mocks.migrate
}));

async function importIntegrationDbModule() {
  return import("../integration/db");
}

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  delete process.env.DATABASE_URL;
  mocks.getCachedNextDbClient.mockImplementation(() => null);
});

afterEach(async () => {
  const { closeIntegrationTestClient } = await importIntegrationDbModule();
  await closeIntegrationTestClient();
  delete process.env.DATABASE_URL;
});

describe("integration DB helpers", () => {
  it("ładuje środowisko testowe tylko raz", async () => {
    const { loadIntegrationTestEnv } = await importIntegrationDbModule();

    loadIntegrationTestEnv();
    loadIntegrationTestEnv();

    expect(mocks.loadEnv).toHaveBeenCalledTimes(1);
    expect(process.env.DATABASE_URL).toContain("jk_integration");
  });

  it("wyrzuca błąd, gdy DATABASE_URL pozostaje niezdefiniowane", async () => {
    mocks.loadEnv.mockImplementationOnce(() => {
      delete process.env.DATABASE_URL;
    });

    const { loadIntegrationTestEnv } = await importIntegrationDbModule();

    expect(() => loadIntegrationTestEnv()).toThrow(/DATABASE_URL/);
  });

  it("tworzy i cache'uje klienta integracyjnego", async () => {
    const { getIntegrationTestClient } = await importIntegrationDbModule();

    const first = getIntegrationTestClient();
    const second = getIntegrationTestClient();

    expect(first).toBe(second);
    expect(mocks.createDbClient).toHaveBeenCalledTimes(1);
    expect(mocks.createDbClient).toHaveBeenCalledWith(expect.stringContaining("postgres://"));
  });

  it("stosuje migracje tylko raz", async () => {
    const { ensureIntegrationTestMigrations, getIntegrationTestClient } =
      await importIntegrationDbModule();

    const client = getIntegrationTestClient();

    await ensureIntegrationTestMigrations();
    await ensureIntegrationTestMigrations();

    expect(mocks.migrate).toHaveBeenCalledTimes(1);
    expect(mocks.migrate).toHaveBeenCalledWith(client.db, {
      migrationsFolder: expect.stringContaining("drizzle")
    });
  });

  it("zamyka połączenie puli przy sprzątaniu", async () => {
    const { getIntegrationTestClient, closeIntegrationTestClient } =
      await importIntegrationDbModule();

    getIntegrationTestClient();
    const lastClient = mocks.getLastCreatedClient();
    expect(lastClient).not.toBeNull();

    await closeIntegrationTestClient();

    expect(lastClient?.poolEnd).toHaveBeenCalledTimes(1);
    expect(mocks.createDbClient).toHaveBeenCalledTimes(1);

    getIntegrationTestClient();
    expect(mocks.createDbClient).toHaveBeenCalledTimes(2);
  });

  it("usuwa cache klienta Next.js, gdy istnieje aktywne połączenie", async () => {
    mocks.getCachedNextDbClient.mockImplementationOnce(() => ({}) as unknown as DbClient);

    const { resetCachedNextDbClient } = await importIntegrationDbModule();

    await resetCachedNextDbClient();

    expect(mocks.disposeNextDbClient).toHaveBeenCalledTimes(1);
    expect(mocks.resetNextDbClient).not.toHaveBeenCalled();
  });

  it("resetuje cache Next.js, gdy brak klienta", async () => {
    mocks.getCachedNextDbClient.mockImplementationOnce(() => null);

    const { resetCachedNextDbClient } = await importIntegrationDbModule();

    await resetCachedNextDbClient();

    expect(mocks.resetNextDbClient).toHaveBeenCalledTimes(1);
    expect(mocks.disposeNextDbClient).not.toHaveBeenCalled();
  });
});
