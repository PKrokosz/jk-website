#!/usr/bin/env tsx
/* eslint-disable no-console */
import { existsSync } from "node:fs";
import { isAbsolute, resolve as resolvePath } from "node:path";

import {
  buildNavigationGraph,
  formatJourney,
  simulateUserJourneys,
  validateJourneysHaveLoops,
} from "../src/lib/navigation/journey-simulation";

interface CliOptions {
  configPath?: string;
  showHelp?: boolean;
}

const parseArgs = (): CliOptions => {
  const args = process.argv.slice(2);
  const options: CliOptions = {};

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

    if (arg === "--help" || arg === "-h") {
      options.showHelp = true;
    }
  }

  return options;
};

const printUsage = (): void => {
  console.log("Usage: pnpm simulate:navigation --config <path-to-json>");
  console.log("Loads navigation weights from the provided JSON file and prints journey summaries.");
};

const run = (): void => {
  const { configPath, showHelp } = parseArgs();

  if (showHelp) {
    printUsage();
    return;
  }

  if (!configPath) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const resolvedPath = isAbsolute(configPath)
    ? configPath
    : resolvePath(process.cwd(), configPath);

  if (!existsSync(resolvedPath)) {
    console.error(`Configuration file not found at: ${resolvedPath}`);
    process.exitCode = 1;
    return;
  }

  try {
    const graph = buildNavigationGraph({
      env: {
        ...process.env,
        NAVIGATION_WEIGHTS_PATH: resolvedPath,
      },
    });

    const journeys = simulateUserJourneys({ graph });
    validateJourneysHaveLoops(journeys);

    journeys.forEach((journey) => {
      console.log(formatJourney(journey));
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Failed to simulate navigation: ${message}`);
    process.exitCode = 1;
  }
};

run();
