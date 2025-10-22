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
});
