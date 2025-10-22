import { describe, expect, it } from "vitest";

import { COMMANDS, getCommandDefinition, listCommandDefinitions } from "../commands";

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
