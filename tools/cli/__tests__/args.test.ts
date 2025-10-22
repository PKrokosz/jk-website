import { describe, expect, it } from "vitest";

import { parseArguments } from "../args";

describe("parseArguments", () => {
  it("parses command name and flags", () => {
    const parsed = parseArguments(["quality", "--dry-run", "--skip=lint,e2e"]);

    expect(parsed.commandName).toBe("quality");
    expect(parsed.dryRun).toBe(true);
    expect(parsed.withIntegrationDb).toBe(false);
    expect(parsed.skip).toEqual(new Set(["lint", "e2e"]));
    expect(parsed.errors).toHaveLength(0);
  });

  it("collects errors for unknown arguments", () => {
    const parsed = parseArguments(["--unknown", "quality"]);

    expect(parsed.errors).toContain("Unknown argument: --unknown");
    expect(parsed.commandName).toBe("quality");
  });

  it("ignores argument separators", () => {
    const parsed = parseArguments(["--", "quality"]);

    expect(parsed.errors).toHaveLength(0);
    expect(parsed.commandName).toBe("quality");
  });

  it("requires value for --skip when provided separately", () => {
    const parsed = parseArguments(["quality", "--skip", "--dry-run"]);

    expect(parsed.errors).toContain("--skip flag requires a comma separated list of step ids");
    expect(parsed.skip.size).toBe(0);
  });

  it("ustawia withIntegrationDb po użyciu flagi", () => {
    const parsed = parseArguments(["quality", "--with-integration-db"]);

    expect(parsed.withIntegrationDb).toBe(true);
    expect(parsed.errors).toHaveLength(0);
  });
});
