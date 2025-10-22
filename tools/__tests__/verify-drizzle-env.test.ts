import { describe, expect, it } from "vitest";

import { compareDatabaseUrlWithCompose } from "../verify-drizzle-env";

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
