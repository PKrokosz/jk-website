import { describe, expect, it } from "vitest";

import { COMMANDS, getCommandDefinition, listCommandDefinitions } from "../commands";
import { REQUIRED_ENVIRONMENT_VARIABLES } from "../../verify-drizzle-env";

describe("command registry", () => {
  it("lists commands in alphabetical order", () => {
    const definitions = listCommandDefinitions();
    const names = definitions.map((definition) => definition.name);

    expect(names).toEqual([...names].sort());
  });

  it("returns definitions by name", () => {
    for (const [name, definition] of Object.entries(COMMANDS)) {
      expect(getCommandDefinition(name)).toEqual(definition);
    }
  });

  it("definiuje krok sprzątania dla scenariusza quality:ci", () => {
    const cleanupSteps = COMMANDS["quality:ci"].cleanupSteps ?? [];

    expect(cleanupSteps).toContainEqual(
      expect.objectContaining({
        id: "cleanup-node20-db",
        command: "docker",
        args: ["compose", "down", "--volumes", "jkdb"],
        title: expect.stringContaining("Cleanup Node 20"),
        description: expect.stringContaining("jkdb")
      })
    );
  });
});

describe("CLI environment verification", () => {
  it("eksportuje listę wymaganych zmiennych środowiskowych", () => {
    const variableNames = REQUIRED_ENVIRONMENT_VARIABLES.map((requirement) => requirement.name);

    expect(variableNames).toEqual(
      expect.arrayContaining([
        "DATABASE_URL",
        "NEXT_PUBLIC_ORDER_FORM_URL",
        "SMTP_HOST",
        "SMTP_PORT",
        "SMTP_USER",
        "SMTP_PASS",
        "MAIL_FROM",
        "MAIL_TO"
      ])
    );
  });

  it("wykorzystuje skrypt w obu komendach jakości CLI", () => {
    const qualityVerifyStep = COMMANDS.quality.steps.find((step) => step.id === "verify-drizzle-env");
    const qualityCiVerifyStep = COMMANDS["quality:ci"].steps.find(
      (step) => step.id === "verify-drizzle-env"
    );

    expect(qualityVerifyStep).toBeDefined();
    expect(qualityCiVerifyStep).toBeDefined();

    expect(qualityVerifyStep?.args).toEqual([
      "exec",
      "tsx",
      "tools/verify-drizzle-env.ts"
    ]);
    expect(qualityCiVerifyStep?.args).toEqual([
      "exec",
      "tsx",
      "tools/verify-drizzle-env.ts"
    ]);

    const summaryList = REQUIRED_ENVIRONMENT_VARIABLES.map((requirement) => requirement.name).join(", ");

    expect(qualityVerifyStep?.description).toContain(summaryList);
    expect(qualityCiVerifyStep?.description).toContain(summaryList);
  });

  it("dodaje krok kontroli migracji Drizzle do obu bramek jakości", () => {
    const qualityDrizzleStep = COMMANDS.quality.steps.find(
      (step) => step.id === "drizzle-generate-dry-run"
    );
    const qualityCiDrizzleStep = COMMANDS["quality:ci"].steps.find(
      (step) => step.id === "drizzle-generate-dry-run"
    );

    expect(qualityDrizzleStep).toBeDefined();
    expect(qualityCiDrizzleStep).toBeDefined();

    expect(qualityDrizzleStep?.command).toBe("pnpm");
    expect(qualityDrizzleStep?.args).toEqual([
      "exec",
      "tsx",
      "tools/cli/drizzle-generate-check.ts"
    ]);

    expect(qualityCiDrizzleStep?.args).toEqual([
      "exec",
      "tsx",
      "tools/cli/drizzle-generate-check.ts"
    ]);
    expect(qualityDrizzleStep?.description).toContain("drizzle/");
    expect(qualityCiDrizzleStep?.description).toContain("drizzle/");
  });

  it("w scenariuszu quality:ci przygotowuje bazę i uruchamia testy integracyjne", () => {
    const qualityCiSteps = COMMANDS["quality:ci"].steps;

    const prepareStepIndex = qualityCiSteps.findIndex(
      (step) => step.id === "prepare-integration-db"
    );
    const integrationTestStepIndex = qualityCiSteps.findIndex(
      (step) => step.id === "integration-tests"
    );

    expect(prepareStepIndex).toBeGreaterThanOrEqual(0);
    expect(integrationTestStepIndex).toBeGreaterThan(prepareStepIndex);

    expect(qualityCiSteps[prepareStepIndex]).toEqual(
      expect.objectContaining({
        command: "pnpm",
        args: ["exec", "tsx", "scripts/prepare-integration-db.ts"],
        description: expect.stringContaining("jkdb")
      })
    );

    expect(qualityCiSteps[integrationTestStepIndex]).toEqual(
      expect.objectContaining({
        command: "pnpm",
        args: ["test", "src/app/api/products/route.integration.test.ts"],
        description: expect.stringContaining("Vitest")
      })
    );
  });
});
