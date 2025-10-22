#!/usr/bin/env tsx
/* eslint-disable no-console */
import { existsSync } from "node:fs";
import { isAbsolute, resolve as resolvePath } from "node:path";
import { fileURLToPath } from "node:url";

import {
  aggregateJourneyTransitions,
  buildNavigationGraph,
  formatJourney,
  simulateUserJourneys,
  validateJourneysHaveLoops,
} from "../src/lib/navigation/journey-simulation";

interface CliOptions {
  configPath?: string;
  showHelp?: boolean;
  userCount?: number;
  summary?: boolean;
  errors: string[];
}

const parseBoolean = (value: string): boolean | undefined => {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return undefined;
};

const parseArgs = (argv: string[] = process.argv.slice(2)): CliOptions => {
  const options: CliOptions = { errors: [] };
  const args = [...argv];

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--config" || arg === "-c") {
      options.configPath = args[index + 1];
      index += 1;
      continue;
    }

    if (arg.startsWith("--config=")) {
      options.configPath = arg.split("=")[1];
      continue;
    }

    if (arg === "--user-count") {
      const value = args[index + 1];

      if (!value) {
        options.errors.push("Missing value for --user-count");
      } else {
        const parsed = Number.parseInt(value, 10);

        if (Number.isNaN(parsed) || parsed <= 0) {
          options.errors.push("--user-count must be a positive integer");
        } else {
          options.userCount = parsed;
        }
      }

      index += 1;
      continue;
    }

    if (arg.startsWith("--user-count=")) {
      const value = arg.split("=")[1];
      const parsed = Number.parseInt(value, 10);

      if (Number.isNaN(parsed) || parsed <= 0) {
        options.errors.push("--user-count must be a positive integer");
      } else {
        options.userCount = parsed;
      }

      continue;
    }

    if (arg === "--summary") {
      options.summary = true;
      continue;
    }

    if (arg.startsWith("--summary=")) {
      const value = arg.split("=")[1];
      const parsed = parseBoolean(value);

      if (parsed === undefined) {
        options.errors.push("--summary expects a boolean value");
      } else {
        options.summary = parsed;
      }

      continue;
    }

    if (arg === "--help" || arg === "-h") {
      options.showHelp = true;
    }
  }

  return options;
};

const printUsage = (logger: Pick<Console, "log"> = console): void => {
  logger.log("Usage: pnpm simulate:navigation --config <path-to-json> [--user-count <number>] [--summary]");
  logger.log(
    "Loads navigation weights from the provided JSON file and prints journey summaries. Use --summary to see aggregated transitions.",
  );
};

interface RunOptions {
  argv?: string[];
  console?: Pick<Console, "log" | "error">;
  env?: NodeJS.ProcessEnv;
}

export const run = ({
  argv = process.argv.slice(2),
  console: cliConsole = console,
  env = process.env,
}: RunOptions = {}): number => {
  const { configPath, showHelp, userCount, summary, errors } = parseArgs(argv);

  if (showHelp) {
    printUsage(cliConsole);
    return 0;
  }

  if (errors.length > 0) {
    errors.forEach((error) => {
      cliConsole.error(error);
    });
    printUsage(cliConsole);
    return 1;
  }

  if (!configPath) {
    printUsage(cliConsole);
    return 1;
  }

  const resolvedPath = isAbsolute(configPath)
    ? configPath
    : resolvePath(process.cwd(), configPath);

  if (!existsSync(resolvedPath)) {
    cliConsole.error(`Configuration file not found at: ${resolvedPath}`);
    return 1;
  }

  try {
    const graph = buildNavigationGraph({
      env: {
        ...env,
        NAVIGATION_WEIGHTS_PATH: resolvedPath,
      },
    });

    const journeys = simulateUserJourneys({
      graph,
      userCount,
    });
    validateJourneysHaveLoops(journeys);

    journeys.forEach((journey) => {
      cliConsole.log(formatJourney(journey));
    });

    if (summary) {
      const aggregates = aggregateJourneyTransitions(journeys);

      if (aggregates.length === 0) {
        cliConsole.log("No transitions recorded.");
      } else {
        cliConsole.log("");
        cliConsole.log("Summary (transitions per edge):");
        aggregates.forEach((aggregate) => {
          cliConsole.log(`${aggregate.from} -> ${aggregate.to}: ${aggregate.count}`);
        });
      }
    }
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    cliConsole.error(`Failed to simulate navigation: ${message}`);
    return 1;
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const exitCode = run();
  if (exitCode !== 0) {
    process.exitCode = exitCode;
  }
}
