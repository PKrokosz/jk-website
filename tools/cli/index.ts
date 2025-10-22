#!/usr/bin/env node
import { getCommandDefinition, listCommandDefinitions } from "./commands";
import { parseArguments } from "./args";
import { runCommandDefinition, StepExecutionError } from "./runner";

const printUsage = (): void => {
  console.log(`Usage: pnpm run cli <command> [options]\n`);
  console.log("Commands:");
  for (const definition of listCommandDefinitions()) {
    console.log(`  ${definition.name.padEnd(12)} ${definition.summary}`);
  }
  console.log("\nOptions:");
  console.log("  --dry-run           Print the steps without executing them");
  console.log("  --skip=<ids>        Skip comma separated step ids (e.g. --skip=build,e2e)");
  console.log("  --list              List available commands");
  console.log("  -h, --help          Show this help message");
};

export const main = async () => {
  const parsed = parseArguments(process.argv.slice(2));

  if (parsed.list) {
    printUsage();
    process.exit(0);
  }

  if (parsed.help || !parsed.commandName) {
    if (parsed.errors.length > 0) {
      parsed.errors.forEach((error) => console.error(error));
    }
    printUsage();
    process.exit(parsed.commandName ? 0 : 1);
  }

  if (parsed.errors.length > 0) {
    parsed.errors.forEach((error) => console.error(error));
    process.exit(1);
  }

  const definition = getCommandDefinition(parsed.commandName);

  if (!definition) {
    console.error(`Unknown command: ${parsed.commandName}`);
    printUsage();
    process.exit(1);
  }

  try {
    await runCommandDefinition(definition, {
      dryRun: parsed.dryRun,
      skip: parsed.skip
    });
  } catch (error) {
    if (error instanceof StepExecutionError) {
      console.error(`Step \"${error.step.id}\" failed: ${error.message}`);
    } else if (error instanceof Error) {
      console.error(error.message);
    }
    process.exit(1);
  }
};

if (process.env.CLI_TEST_MODE !== "1") {
  void main();
}
