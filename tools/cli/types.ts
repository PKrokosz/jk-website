export interface CommandStep {
  id: string;
  title: string;
  command: string;
  args: string[];
  description?: string;
  env?: Record<string, string | undefined>;
}

export interface CommandDefinition {
  name: string;
  summary: string;
  steps: CommandStep[];
}

export interface RunCommandOptions {
  dryRun?: boolean;
  skip?: Set<string>;
  executor?: StepExecutor;
}

export type StepExecutor = (step: CommandStep) => Promise<void>;
