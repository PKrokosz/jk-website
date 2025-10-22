import { spawn } from "node:child_process";

import type { CommandDefinition, CommandStep, RunCommandOptions, StepExecutor } from "./types";

export class StepExecutionError extends Error {
  constructor(public readonly step: CommandStep, message: string) {
    super(message);
    this.name = "StepExecutionError";
  }
}

export const formatStep = (step: CommandStep): string => {
  const args = step.args.join(" ");
  return `${step.command} ${args}`.trim();
};

export const defaultExecutor: StepExecutor = async (step) => {
  const child = spawn(step.command, step.args, {
    stdio: "inherit",
    shell: false,
    env: { ...process.env, ...step.env }
  });

  await new Promise<void>((resolve, reject) => {
    child.on("error", (error) => {
      reject(new StepExecutionError(step, error.message));
    });

    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      const reason =
        signal !== null
          ? `terminated with signal ${signal}`
          : `exited with code ${code ?? "unknown"}`;
      reject(new StepExecutionError(step, reason));
    });
  });
};

export interface RunResult {
  executedSteps: string[];
  skippedSteps: string[];
}

export const runCommandDefinition = async (
  definition: CommandDefinition,
  options: RunCommandOptions = {}
): Promise<RunResult> => {
  const executedSteps: string[] = [];
  const skippedSteps: string[] = [];
  const skipSet = options.skip ?? new Set<string>();
  const executor = options.executor ?? defaultExecutor;
  const failures: unknown[] = [];

  const runSingleStep = async (step: CommandStep): Promise<void> => {
    if (skipSet.has(step.id)) {
      skippedSteps.push(step.id);
      return;
    }

    if (options.dryRun) {
      console.log(`• ${step.title}: ${formatStep(step)}`);
      executedSteps.push(step.id);
      return;
    }

    console.log(`→ ${step.title}`);
    await executor(step);
    executedSteps.push(step.id);
  };

  for (const step of definition.steps) {
    try {
      await runSingleStep(step);
    } catch (error) {
      failures.push(error);
      break;
    }
  }

  if (definition.cleanupSteps?.length) {
    for (const step of definition.cleanupSteps) {
      try {
        await runSingleStep(step);
      } catch (error) {
        failures.push(error);
      }
    }
  }

  if (failures.length > 0) {
    const [primary, ...others] = failures;

    if (others.length === 0) {
      throw primary;
    }

    const formatAdditionalError = (error: unknown): string => {
      if (error instanceof StepExecutionError) {
        return `cleanup step "${error.step.id}" failed: ${error.message}`;
      }

      if (error instanceof Error) {
        return error.message;
      }

      return String(error);
    };

    const additionalMessage = others.map(formatAdditionalError).join("; ");

    if (primary instanceof StepExecutionError) {
      const combined = new StepExecutionError(
        primary.step,
        `${primary.message}; dodatkowe błędy: ${additionalMessage}`
      );
      combined.stack = primary.stack;
      (combined as { cause?: unknown }).cause =
        others.length === 1 ? others[0] : new AggregateError(others);
      throw combined;
    }

    if (primary instanceof Error) {
      primary.message = `${primary.message}; dodatkowe błędy: ${additionalMessage}`;
      throw primary;
    }

    throw new Error(`Command execution failed; dodatkowe błędy: ${additionalMessage}`);
  }

  return { executedSteps, skippedSteps };
};
