import { REQUIRED_ENVIRONMENT_VARIABLES } from "../verify-drizzle-env";
import type { CommandDefinition, CommandStep } from "./types";

const REQUIRED_ENV_SUMMARY = REQUIRED_ENVIRONMENT_VARIABLES.map((requirement) => requirement.name).join(
  ", "
);

const VERIFY_ENV_DESCRIPTION =
  "Sprawdza wymagane zmienne środowiskowe (" +
  REQUIRED_ENV_SUMMARY +
  ") przed uruchomieniem kontroli jakości.";

const QUALITY_PREPARE_INTEGRATION_DB_STEP: CommandStep = {
  id: "prepare-integration-db",
  title: "Prepare integration database",
  command: "pnpm",
  args: ["exec", "tsx", "scripts/prepare-integration-db.ts"],
  description:
    "Uruchamia kontener jkdb, czeka na połączenie i wykonuje `pnpm db:migrate` oraz `pnpm db:seed` z konfiguracją .env.test."
};

const QUALITY_STEPS: CommandStep[] = [
  {
    id: "verify-drizzle-env",
    title: "Verify Drizzle env",
    command: "pnpm",
    args: ["exec", "tsx", "tools/verify-drizzle-env.ts"],
    description: VERIFY_ENV_DESCRIPTION
  },
  {
    id: "drizzle-generate-dry-run",
    title: "Drizzle generate dry-run",
    command: "pnpm",
    args: ["exec", "tsx", "tools/cli/drizzle-generate-check.ts"],
    description:
      "Uruchamia `pnpm db:generate` i sprawdza, czy katalog drizzle/ pozostał niezmieniony."
  },
  {
    id: "lint",
    title: "ESLint",
    command: "pnpm",
    args: ["lint"],
    description: "Runs Next.js lint rules to ensure code quality."
  },
  {
    id: "typecheck",
    title: "TypeScript",
    command: "pnpm",
    args: ["typecheck"],
    description: "Executes strict TypeScript checks without emitting output."
  },
  {
    id: "unit-tests",
    title: "Unit tests",
    command: "pnpm",
    args: ["test"],
    description: "Runs Vitest unit and component test suite."
  }
];

export const COMMANDS: Record<string, CommandDefinition> = {
  quality: {
    name: "quality",
    summary: "Run lint, type checks and unit tests (local developer workflow).",
    steps: QUALITY_STEPS
  },
  "quality:ci": {
    name: "quality:ci",
    summary:
      "Run the full CI gate including lint, type checks, build, coverage, e2e and depcheck.",
    steps: [
      {
        id: "verify-drizzle-env",
        title: "Verify Drizzle env",
        command: "pnpm",
        args: ["exec", "tsx", "tools/verify-drizzle-env.ts"],
        description: VERIFY_ENV_DESCRIPTION
      },
      {
        id: "drizzle-generate-dry-run",
        title: "Drizzle generate dry-run",
        command: "pnpm",
        args: ["exec", "tsx", "tools/cli/drizzle-generate-check.ts"],
        description:
          "Uruchamia `pnpm db:generate` i sprawdza, czy katalog drizzle/ pozostał niezmieniony."
      },
      {
        id: "lint",
        title: "ESLint",
        command: "pnpm",
        args: ["lint"],
        description: "Runs Next.js lint rules to ensure code quality."
      },
      {
        id: "typecheck",
        title: "TypeScript",
        command: "pnpm",
        args: ["typecheck"],
        description: "Executes strict TypeScript checks without emitting output."
      },
      {
        id: "build",
        title: "Build",
        command: "pnpm",
        args: ["build"],
        description: "Generates the production build to validate compilation."
      },
      {
        id: "unit-tests",
        title: "Unit tests",
        command: "pnpm",
        args: ["test"],
        description: "Runs Vitest unit and component test suite."
      },
      {
        id: "coverage",
        title: "Coverage",
        command: "pnpm",
        args: ["test:coverage"],
        description: "Produces the lcov coverage report used for CI artifacts."
      },
      {
        id: "prepare-integration-db",
        title: "Prepare integration database",
        command: "pnpm",
        args: ["exec", "tsx", "scripts/prepare-integration-db.ts"],
        description:
          "Uruchamia kontener jkdb, czeka na połączenie i wykonuje `pnpm db:migrate` oraz `pnpm db:seed` z konfiguracją .env.test."
      },
      {
        id: "integration-tests",
        title: "Integration tests",
        command: "pnpm",
        args: ["test", "src/app/api/products/route.integration.test.ts"],
        description:
          "Uruchamia scenariusze Vitest łączące się z prawdziwą bazą, aby zweryfikować degradację katalogu."
      },
      {
        id: "e2e",
        title: "Playwright e2e",
        command: "pnpm",
        args: ["test:e2e"],
        env: {
          PLAYWRIGHT_WEB_SERVER_COMMAND: "pnpm start -- --hostname 0.0.0.0 --port 3000"
        },
        description: "Executes Playwright end-to-end suite with production server."
      },
      {
        id: "depcheck",
        title: "Depcheck",
        command: "pnpm",
        args: ["depcheck"],
        description: "Validates dependency usage to prevent unused packages."
      }
    ],
    cleanupSteps: [
      {
        id: "cleanup-node20-db",
        title: "Cleanup Node 20 database",
        command: "docker",
        args: ["compose", "down", "--volumes", "jkdb"],
        description:
          "Stops the Node 20 Postgres container and removes the jkdb volumes after CI checks."
      }
    ]
  }
};

export const listCommandDefinitions = (): CommandDefinition[] =>
  Object.values(COMMANDS).sort((a, b) => a.name.localeCompare(b.name));

export interface CommandLookupOptions {
  withIntegrationDb?: boolean;
}

export const getCommandDefinition = (
  name: string,
  options?: CommandLookupOptions
): CommandDefinition | undefined => {
  const definition = COMMANDS[name];

  if (!definition) {
    return undefined;
  }

  if (name === "quality" && options?.withIntegrationDb) {
    const drizzleIndex = definition.steps.findIndex(
      (step) => step.id === "drizzle-generate-dry-run"
    );
    const insertionIndex = drizzleIndex >= 0 ? drizzleIndex + 1 : definition.steps.length;

    return {
      ...definition,
      steps: [
        ...definition.steps.slice(0, insertionIndex),
        QUALITY_PREPARE_INTEGRATION_DB_STEP,
        ...definition.steps.slice(insertionIndex)
      ]
    } satisfies CommandDefinition;
  }

  return definition;
};
