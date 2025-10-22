export interface ParsedArguments {
  commandName?: string;
  dryRun: boolean;
  list: boolean;
  help: boolean;
  withIntegrationDb: boolean;
  skip: Set<string>;
  errors: string[];
}

const isFlag = (value: string): boolean => value.startsWith("-");

const parseList = (value: string | undefined): string[] => {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

export const parseArguments = (argv: string[]): ParsedArguments => {
  const result: ParsedArguments = {
    commandName: undefined,
    dryRun: false,
    list: false,
    help: false,
    withIntegrationDb: false,
    skip: new Set<string>(),
    errors: []
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];

    if (value === "--") {
      continue;
    }

    if (value === "--dry-run") {
      result.dryRun = true;
      continue;
    }

    if (value === "--with-integration-db") {
      result.withIntegrationDb = true;
      continue;
    }

    if (value === "--list") {
      result.list = true;
      continue;
    }

    if (value === "--help" || value === "-h") {
      result.help = true;
      continue;
    }

    if (value.startsWith("--skip")) {
      const [, inlineValue] = value.split("=");
      if (inlineValue) {
        parseList(inlineValue).forEach((item) => result.skip.add(item));
        continue;
      }

      const next = argv[index + 1];
      if (!next || isFlag(next)) {
        result.errors.push("--skip flag requires a comma separated list of step ids");
        continue;
      }

      parseList(next).forEach((item) => result.skip.add(item));
      index += 1;
      continue;
    }

    if (!result.commandName && !isFlag(value)) {
      result.commandName = value;
      continue;
    }

    result.errors.push(`Unknown argument: ${value}`);
  }

  return result;
};
