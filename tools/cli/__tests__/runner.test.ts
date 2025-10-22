import { EventEmitter } from "node:events";

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  StepExecutionError,
  defaultExecutor,
  formatStep,
  runCommandDefinition,
  type RunResult
} from "../runner";
import type { CommandDefinition, CommandStep } from "../types";

vi.mock("node:child_process", () => ({
  spawn: vi.fn()
}));

const { spawn } = await import("node:child_process");
const spawnMock = vi.mocked(spawn);

// Mirrors the first quality step so expectations stay aligned with CLI defaults.
const VERIFY_DRIZZLE_ENV_STEP: CommandStep = {
  id: "verify-drizzle-env",
  title: "Verify Drizzle env",
  command: "pnpm",
  args: ["exec", "tsx", "tools/verify-drizzle-env.ts"],
  env: {}
};

describe("runner", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("formats command steps including arguments", () => {
    expect(formatStep({ id: "lint", title: "Lint", command: "pnpm", args: ["lint"], env: {} })).toBe("pnpm lint");
    expect(formatStep({ id: "typecheck", title: "Type", command: "pnpm", args: [], env: {} })).toBe("pnpm");
  });

  it("runs steps sequentially respecting skip and dry-run options", async () => {
    const executor = vi.fn().mockResolvedValue(undefined);
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);

    const definition: CommandDefinition = {
      name: "qa",
      summary: "Quality checks",
      steps: [
        VERIFY_DRIZZLE_ENV_STEP,
        { id: "lint", title: "Lint", command: "pnpm", args: ["lint"], env: {} },
        { id: "test", title: "Test", command: "pnpm", args: ["test"], env: {} }
      ]
    };

    const result = await runCommandDefinition(
      definition,
      {
        dryRun: true,
        skip: new Set(["lint"]),
        executor
      }
    );

    expect(result).toEqual<RunResult>({
      executedSteps: ["verify-drizzle-env", "test"],
      skippedSteps: ["lint"]
    });
    expect(consoleSpy).toHaveBeenNthCalledWith(
      1,
      "• Verify Drizzle env: pnpm exec tsx tools/verify-drizzle-env.ts"
    );
    expect(consoleSpy).toHaveBeenNthCalledWith(2, "• Test: pnpm test");
    expect(consoleSpy).not.toHaveBeenCalledWith("• Lint: pnpm lint");
    expect(executor).not.toHaveBeenCalled();
  });

  it("throws StepExecutionError when executor fails", async () => {
    const failingStep: CommandStep = { id: "test", title: "Test", command: "pnpm", args: ["test"], env: {} };
    const error = new StepExecutionError(failingStep, "failed");
    const executor = vi.fn().mockRejectedValue(error);

    await expect(
      runCommandDefinition(
        {
          name: "qa",
          summary: "Quality",
          steps: [failingStep]
        },
        { executor }
      )
    ).rejects.toThrow(error);
  });

  it("uruchamia kroki sprzątające nawet przy błędzie głównego scenariusza", async () => {
    const successStep: CommandStep = { id: "lint", title: "Lint", command: "pnpm", args: ["lint"], env: {} };
    const failingStep: CommandStep = { id: "test", title: "Test", command: "pnpm", args: ["test"], env: {} };
    const cleanupStep: CommandStep = {
      id: "cleanup-node20-db",
      title: "Cleanup Node 20 database",
      command: "docker",
      args: ["compose", "down", "--volumes", "jkdb"],
      env: {}
    };

    const failure = new StepExecutionError(failingStep, "exited with code 1");
    const executor = vi
      .fn()
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(failure)
      .mockResolvedValueOnce(undefined);

    await expect(
      runCommandDefinition(
        {
          name: "qa",
          summary: "Quality",
          steps: [successStep, failingStep],
          cleanupSteps: [cleanupStep]
        },
        { executor }
      )
    ).rejects.toBeInstanceOf(StepExecutionError);

    expect(executor).toHaveBeenCalledTimes(3);
    expect(executor).toHaveBeenNthCalledWith(1, successStep);
    expect(executor).toHaveBeenNthCalledWith(2, failingStep);
    expect(executor).toHaveBeenNthCalledWith(3, cleanupStep);
  });

  it("pozwala pominąć krok sprzątania przy użyciu flagi skip", async () => {
    const mainStep: CommandStep = { id: "lint", title: "Lint", command: "pnpm", args: ["lint"], env: {} };
    const cleanupStep: CommandStep = {
      id: "cleanup-node20-db",
      title: "Cleanup Node 20 database",
      command: "docker",
      args: ["compose", "down", "--volumes", "jkdb"],
      env: {}
    };

    const executor = vi.fn().mockResolvedValue(undefined);

    const result = await runCommandDefinition(
      {
        name: "qa",
        summary: "Quality",
        steps: [mainStep],
        cleanupSteps: [cleanupStep]
      },
      { executor, skip: new Set(["cleanup-node20-db"]) }
    );

    expect(result.executedSteps).toEqual(["lint"]);
    expect(result.skippedSteps).toContain("cleanup-node20-db");
    expect(executor).toHaveBeenCalledTimes(1);
    expect(executor).toHaveBeenCalledWith(mainStep);
  });

  it("resolves when spawned process exits successfully", async () => {
    const child = new EventEmitter() as EventEmitter & { on: EventEmitter["on"] };
    spawnMock.mockReturnValue(child as unknown as ReturnType<typeof spawnMock>);

    const promise = defaultExecutor({ id: "build", title: "Build", command: "pnpm", args: ["build"], env: {} });
    child.emit("exit", 0, null);

    await expect(promise).resolves.toBeUndefined();
  });

  it("rejects with StepExecutionError on non-zero exit code", async () => {
    const child = new EventEmitter();
    spawnMock.mockReturnValue(child as unknown as ReturnType<typeof spawnMock>);

    const promise = defaultExecutor({ id: "test", title: "Test", command: "pnpm", args: ["test"], env: {} });
    child.emit("exit", 1, null);

    await expect(promise).rejects.toBeInstanceOf(StepExecutionError);
  });

  it("rejects with StepExecutionError when process emits error", async () => {
    const child = new EventEmitter();
    spawnMock.mockReturnValue(child as unknown as ReturnType<typeof spawnMock>);

    const promise = defaultExecutor({ id: "test", title: "Test", command: "pnpm", args: ["test"], env: {} });
    child.emit("error", new Error("spawn failed"));

    await expect(promise).rejects.toBeInstanceOf(StepExecutionError);
  });
});
