import type { CommandDefinition } from "./types";

export const COMMANDS: Record<string, CommandDefinition> = {
  quality: {
    name: "quality",
    summary: "Run lint, type checks and unit tests (local developer workflow).",
    steps: [
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
    ]
  },
  "quality:ci": {
    name: "quality:ci",
    summary:
      "Run the full CI gate including lint, type checks, build, coverage, e2e and depcheck.",
    steps: [
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
    ]
  }
};

export const listCommandDefinitions = (): CommandDefinition[] =>
  Object.values(COMMANDS).sort((a, b) => a.name.localeCompare(b.name));

export const getCommandDefinition = (name: string): CommandDefinition | undefined =>
  COMMANDS[name];
