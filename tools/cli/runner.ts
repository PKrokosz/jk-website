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

  for (const step of definition.steps) {
    if (skipSet.has(step.id)) {
      skippedSteps.push(step.id);
      continue;
    }

    if (options.dryRun) {
      console.log(`• ${step.title}: ${formatStep(step)}`);
      executedSteps.push(step.id);
      continue;
    }

    console.log(`→ ${step.title}`);
    await executor(step);
    executedSteps.push(step.id);
  }

  return { executedSteps, skippedSteps };
};
