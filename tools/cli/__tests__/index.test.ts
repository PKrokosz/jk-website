import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import type { ParsedArguments } from "../args";
import type { CommandDefinition } from "../types";

const mockParseArguments = vi.fn<[], ParsedArguments>();
const mockListCommandDefinitions = vi.fn<[], CommandDefinition[]>();
const mockGetCommandDefinition = vi.fn<(name: string) => CommandDefinition | undefined>();
const mockRunCommandDefinition = vi.fn();

vi.mock("../args", () => ({
  parseArguments: mockParseArguments
}));

vi.mock("../commands", () => ({
  listCommandDefinitions: mockListCommandDefinitions,
  getCommandDefinition: mockGetCommandDefinition
}));

vi.mock("../runner", async () => {
  const actual = await vi.importActual<typeof import("../runner")>("../runner");

  return {
    StepExecutionError: actual.StepExecutionError,
    runCommandDefinition: mockRunCommandDefinition
  };
});

class ExitCalled extends Error {
  constructor(public readonly code: number | undefined) {
    super("Exit called");
  }
}

const originalArgv = process.argv.slice();
const exitSpy = vi.spyOn(process, "exit");
const logSpy = vi.spyOn(console, "log");
const errorSpy = vi.spyOn(console, "error");

afterAll(() => {
  exitSpy.mockRestore();
  logSpy.mockRestore();
  errorSpy.mockRestore();
  process.argv = originalArgv;
  delete process.env.CLI_TEST_MODE;
});

const baseArgs = (): ParsedArguments => ({
  commandName: undefined,
  dryRun: false,
  list: false,
  help: false,
  skip: new Set<string>(),
  errors: []
});

const extractExitCode = (error: unknown): number | undefined | null => {
  if (error instanceof ExitCalled) {
    return error.code;
  }

  if (error && typeof error === "object" && "code" in error) {
    return (error as { code?: number }).code;
  }

  return null;
};

const invokeMain = async (): Promise<number | undefined> => {
  const module = await import("../index");
  const { main } = module;

  try {
    await main();
    return undefined;
  } catch (error) {
    const exitCode = extractExitCode(error);
    if (exitCode === null) {
      throw error;
    }
    return exitCode;
  }
};

describe("CLI entrypoint", () => {
  beforeEach(() => {
    vi.resetModules();
    mockParseArguments.mockReset();
    mockListCommandDefinitions.mockReset();
    mockGetCommandDefinition.mockReset();
    mockRunCommandDefinition.mockReset();

    exitSpy.mockReset();
    logSpy.mockReset();
    errorSpy.mockReset();

    exitSpy.mockImplementation((code?: number) => {
      throw new ExitCalled(code);
    });
    logSpy.mockImplementation(() => {});
    errorSpy.mockImplementation(() => {});

    mockListCommandDefinitions.mockReturnValue([]);

    process.env.CLI_TEST_MODE = "1";
    process.argv = originalArgv.slice(0, 2);
  });

  it("prints available commands when invoked with --list", async () => {
    mockParseArguments.mockReturnValue({ ...baseArgs(), list: true });
    mockListCommandDefinitions.mockReturnValue([
      { name: "quality", summary: "Run quality checks", steps: [] }
    ]);

    const exitCode = await invokeMain();

    expect(mockListCommandDefinitions).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith("Commands:");
    expect(
      logSpy.mock.calls.some(([value]) =>
        value?.toString().includes("Run quality checks")
      )
    ).toBe(true);
    expect(exitSpy).toHaveBeenCalledWith(0);
    expect(exitCode).toBe(0);
  });

  it("prints usage and exits with error when no command is provided", async () => {
    mockParseArguments.mockReturnValue({
      ...baseArgs(),
      errors: ["Unknown argument: --foo"]
    });

    const exitCode = await invokeMain();

    expect(errorSpy).toHaveBeenCalledWith("Unknown argument: --foo");
    expect(
      logSpy.mock.calls.some(([value]) =>
        value?.toString().startsWith("Usage: pnpm run cli")
      )
    ).toBe(true);
    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(exitCode).toBe(1);
  });

  it("prints usage and exits successfully when only help flag is provided", async () => {
    mockParseArguments.mockReturnValue({
      ...baseArgs(),
      help: true
    });

    const exitCode = await invokeMain();

    expect(logSpy.mock.calls[0]?.[0]).toContain("Usage: pnpm run cli");
    expect(exitSpy).toHaveBeenCalledWith(0);
    expect(exitCode).toBe(0);
  });

  it("stops execution when parsing errors occur for a known command", async () => {
    mockParseArguments.mockReturnValue({
      ...baseArgs(),
      commandName: "quality",
      errors: ["Unknown argument: --foo"],
      list: false
    });

    const exitCode = await invokeMain();

    expect(errorSpy).toHaveBeenCalledWith("Unknown argument: --foo");
    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(exitCode).toBe(1);
    expect(mockGetCommandDefinition).not.toHaveBeenCalled();
  });

  it("reports unknown commands", async () => {
    mockParseArguments.mockReturnValue({
      ...baseArgs(),
      commandName: "deploy"
    });
    mockGetCommandDefinition.mockReturnValue(undefined);

    const exitCode = await invokeMain();

    expect(errorSpy).toHaveBeenCalledWith("Unknown command: deploy");
    expect(logSpy).toHaveBeenCalledWith("Commands:");
    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(exitCode).toBe(1);
  });

  it("runs the matched command definition", async () => {
    const definition: CommandDefinition = {
      name: "quality",
      summary: "Run quality checks",
      steps: []
    };

    mockParseArguments.mockReturnValue({
      ...baseArgs(),
      commandName: "quality",
      dryRun: true,
      skip: new Set(["lint"])
    });
    mockGetCommandDefinition.mockReturnValue(definition);
    mockRunCommandDefinition.mockResolvedValue({ executedSteps: [], skippedSteps: [] });

    const exitCode = await invokeMain();

    expect(mockRunCommandDefinition).toHaveBeenCalledWith(definition, {
      dryRun: true,
      skip: expect.any(Set)
    });
    expect(exitSpy).not.toHaveBeenCalled();
    expect(exitCode).toBeUndefined();

    const options = mockRunCommandDefinition.mock.calls[0][1] as {
      skip?: Set<string>;
    };
    expect(Array.from(options.skip ?? [])).toEqual(["lint"]);
  });

  it("logs generic errors from the runner and exits with status 1", async () => {
    const definition: CommandDefinition = {
      name: "quality",
      summary: "Run quality checks",
      steps: []
    };

    mockParseArguments.mockReturnValue({
      ...baseArgs(),
      commandName: "quality"
    });
    mockGetCommandDefinition.mockReturnValue(definition);
    mockRunCommandDefinition.mockRejectedValue(new Error("unexpected failure"));

    const exitCode = await invokeMain();

    expect(errorSpy).toHaveBeenCalledWith("unexpected failure");
    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(exitCode).toBe(1);
  });

  it("handles step execution failures", async () => {
    const definition: CommandDefinition = {
      name: "quality",
      summary: "Run quality checks",
      steps: [
        { id: "lint", title: "Lint", command: "pnpm", args: ["lint"] }
      ]
    };

    mockParseArguments.mockReturnValue({
      ...baseArgs(),
      commandName: "quality"
    });
    mockGetCommandDefinition.mockReturnValue(definition);

    const { StepExecutionError } = await import("../runner");
    mockRunCommandDefinition.mockRejectedValue(
      new StepExecutionError(definition.steps[0], "lint failed")
    );

    const exitCode = await invokeMain();

    expect(errorSpy).toHaveBeenCalledWith(
      'Step "lint" failed: lint failed'
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(exitCode).toBe(1);
  });
});

describe("command definitions", () => {
  it("includes Drizzle environment verification as the first quality step", async () => {
    const actual = await vi.importActual<typeof import("../commands")>("../commands");
    const qualitySteps = actual.COMMANDS.quality.steps;

    expect(qualitySteps[0]).toMatchObject({
      id: "verify-drizzle-env",
      command: "pnpm",
      args: ["exec", "tsx", "tools/verify-drizzle-env.ts"]
    });
  });
});
