import { describe, expect, it, vi } from "vitest";

import {
  compareDatabaseUrlWithCompose,
  loadVerifyEnvEnvironment
} from "../verify-drizzle-env";

const composeFixture = `services:
  jkdb:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: devpass
      POSTGRES_USER: devuser
      POSTGRES_DB: jkdb
    ports:
      - "5432:5432"
`;

describe("compareDatabaseUrlWithCompose", () => {
  it("wykrywa różnicę między .env.example a docker-compose.yml", () => {
    const envExample = "DATABASE_URL=postgres://devuser:devpass@localhost:6543/jkdb";

    const comparison = compareDatabaseUrlWithCompose(envExample, composeFixture);

    expect(comparison.matches).toBe(false);
    expect(comparison.envDatabaseUrl).toBe(
      "postgres://devuser:devpass@localhost:6543/jkdb"
    );
    expect(comparison.composeDatabaseUrl).toBe(
      "postgres://devuser:devpass@localhost:5432/jkdb"
    );
  });
});

describe("loadVerifyEnvEnvironment", () => {
  it("ładuje domyślną sekwencję plików środowiskowych", () => {
    const loader = vi.fn().mockReturnValue(["/project/.env.example"]);

    const loaded = loadVerifyEnvEnvironment({ loader });

    expect(loader).toHaveBeenCalledWith({
      cwd: process.cwd(),
      files: [".env.local", ".env", ".env.example"]
    });
    expect(loaded).toEqual(["/project/.env.example"]);
  });

  it("pozwala określić katalog roboczy i sekwencję plików", () => {
    const loader = vi.fn().mockReturnValue(["/custom/.env"]);

    const loaded = loadVerifyEnvEnvironment({
      cwd: "/custom",
      sequence: [".env"],
      loader
    });

    expect(loader).toHaveBeenCalledWith({
      cwd: "/custom",
      files: [".env"]
    });
    expect(loaded).toEqual(["/custom/.env"]);
  });
});
