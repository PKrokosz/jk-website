import { afterEach, describe, expect, it, vi } from "vitest";

import { COMMANDS } from "../commands";
import { runCommandDefinition } from "../runner";

const createExecutor = () => {
  const calls: string[] = [];
  const executor = vi.fn(async (step) => {
    calls.push(step.id);
  });
  return { executor, calls };
};

describe("runCommandDefinition", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("executes steps sequentially", async () => {
    const { executor, calls } = createExecutor();
    const result = await runCommandDefinition(COMMANDS.quality, { executor });

    expect(result.executedSteps).toEqual([
      "verify-drizzle-env",
      "lint",
      "typecheck",
      "unit-tests"
    ]);
    expect(calls).toEqual([
      "verify-drizzle-env",
      "lint",
      "typecheck",
      "unit-tests"
    ]);
  });

  it("skips steps provided in options", async () => {
    const { executor, calls } = createExecutor();
    const result = await runCommandDefinition(COMMANDS["quality:ci"], {
      executor,
      skip: new Set(["build", "e2e"])
    });

    expect(result.skippedSteps).toEqual(["build", "e2e"]);
    expect(result.executedSteps).not.toContain("build");
    expect(calls).not.toContain("build");
  });

  it("prints steps during dry run", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const result = await runCommandDefinition(COMMANDS.quality, { dryRun: true });

    expect(result.executedSteps).toEqual([
      "verify-drizzle-env",
      "lint",
      "typecheck",
      "unit-tests"
    ]);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("ESLint"));

    logSpy.mockRestore();
  });
});
