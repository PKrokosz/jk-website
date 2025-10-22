import { resolve as resolvePath } from "node:path";

import { describe, expect, it } from "vitest";

import {
  buildNavigationGraph,
  aggregateJourneyTransitions,
  formatJourney,
  loadNavigationWeights,
  navigationGraph,
  simulateUserJourneys,
  validateJourneysHaveLoops,
} from "../journey-simulation";
import type {
  NavigationGraph,
  NavigationWeightsConfig,
} from "../journey-simulation";

const createSeededRandom = (seed: number): (() => number) => {
  let current = seed;
  return () => {
    current = (current * 1664525 + 1013904223) % 4294967296;
    return current / 4294967296;
  };
};

describe("simulateUserJourneys", () => {
  it("generates the requested number of user journeys with loops", () => {
    const journeys = simulateUserJourneys({
      userCount: 20,
      random: createSeededRandom(42),
    });

    expect(journeys).toHaveLength(20);
    journeys.forEach((journey) => {
      expect(journey.loopDetected).toBe(true);
      let hasLoop = false;
      const visited = new Set([journey.start]);

      journey.steps.forEach((step) => {
        if (visited.has(step.to)) {
          hasLoop = true;
        }
        visited.add(step.to);
      });

      expect(hasLoop).toBe(true);
    });

    expect(() => validateJourneysHaveLoops(journeys)).not.toThrow();
  });

  it("throws when a journey cannot form a loop", () => {
    const brokenGraph: NavigationGraph = {
      ...navigationGraph,
      contact: {
        ...navigationGraph.contact,
        tokens: [],
      },
    };

    expect(() =>
      simulateUserJourneys({
        graph: brokenGraph,
        random: createSeededRandom(1),
        maxSteps: 4,
      }),
    ).toThrowError(/Failed to create a loop/);
  });
});

describe("navigation weight configuration", () => {
  it("applies direct weight overrides when building the graph", () => {
    const overrides: NavigationWeightsConfig = {
      home: {
        contact: 8,
      },
    };

    const graphWithOverrides = buildNavigationGraph({ weights: overrides });
    const contactToken = graphWithOverrides.home.tokens.find(
      (token) => token.target === "contact",
    );

    expect(contactToken?.weight).toBe(8);
  });

  it("loads overrides from JSON environment configuration", () => {
    const env = {
      NODE_ENV: "test",
      NAVIGATION_WEIGHTS_JSON: JSON.stringify({
        catalog: {
          home: 5,
        },
      }),
    } satisfies NodeJS.ProcessEnv;

    const graph = buildNavigationGraph({ env });
    const homeToken = graph.catalog.tokens.find((token) => token.target === "home");

    expect(homeToken?.weight).toBe(5);
  });

  it("ignores comment keys in JSON configuration", () => {
    const env = {
      NAVIGATION_WEIGHTS_JSON: JSON.stringify({
        _comment: "source -> target -> weight",
        home: {
          _comment: "home transitions",
          contact: 4,
        },
      }),
    } satisfies NodeJS.ProcessEnv;

    const graph = buildNavigationGraph({ env });
    const contactToken = graph.home.tokens.find((token) => token.target === "contact");

    expect(contactToken?.weight).toBe(4);
  });

  it("throws when the JSON configuration is invalid", () => {
    const env = {
      NODE_ENV: "test",
      NAVIGATION_WEIGHTS_JSON: "{not-valid",
    } satisfies NodeJS.ProcessEnv;

    expect(() => loadNavigationWeights({ env })).toThrowError(
      /invalid JSON/,
    );
  });

  it("throws when configuration references unknown nodes", () => {
    const env = {
      NODE_ENV: "test",
      NAVIGATION_WEIGHTS_JSON: JSON.stringify({
        unknown: {
          home: 3,
        },
      }),
    } satisfies NodeJS.ProcessEnv;

    expect(() => buildNavigationGraph({ env })).toThrowError(
      /Unknown navigation node/,
    );
  });

  it("throws when configuration references missing transitions", () => {
    const env = {
      NODE_ENV: "test",
      NAVIGATION_WEIGHTS_JSON: JSON.stringify({
        home: {
          order: 2,
        },
      }),
    } satisfies NodeJS.ProcessEnv;

    expect(() => buildNavigationGraph({ env })).toThrowError(
      /does not have a transition/,
    );
  });

  it("loads overrides from JSON file referenced by NAVIGATION_WEIGHTS_PATH", () => {
    const configPath = resolvePath(
      process.cwd(),
      "config/navigation-weights.example.json",
    );

    const env = {
      NAVIGATION_WEIGHTS_PATH: configPath,
    } satisfies NodeJS.ProcessEnv;

    const graph = buildNavigationGraph({ env });

    const catalogToken = graph.home.tokens.find((token) => token.target === "catalog");
    const contactToken = graph.home.tokens.find((token) => token.target === "contact");
    const groupOrdersToken = graph.catalog.tokens.find((token) => token.target === "groupOrders");

    expect(catalogToken?.weight).toBe(6);
    expect(contactToken?.weight).toBe(3);
    expect(groupOrdersToken?.weight).toBe(4);
  });

  it("returns an empty configuration when overrides are not provided", () => {
    expect(loadNavigationWeights({ env: {} as NodeJS.ProcessEnv })).toEqual({});
  });

  it("throws when both JSON and file based overrides are defined", () => {
    const env = {
      NAVIGATION_WEIGHTS_JSON: JSON.stringify({}),
      NAVIGATION_WEIGHTS_PATH: "config/navigation-weights.example.json",
    } satisfies NodeJS.ProcessEnv;

    expect(() => loadNavigationWeights({ env })).toThrowError(/choose only one source/);
  });

  it("throws when weights are not positive numbers", () => {
    const env = {
      NAVIGATION_WEIGHTS_JSON: JSON.stringify({
        home: {
          contact: 0,
        },
      }),
    } satisfies NodeJS.ProcessEnv;

    expect(() => buildNavigationGraph({ env })).toThrowError(/greater than 0/);
  });

  it("throws when weights are not numeric", () => {
    const env = {
      NAVIGATION_WEIGHTS_JSON: JSON.stringify({
        home: {
          contact: "wysokie" as unknown as number,
        },
      }),
    } satisfies NodeJS.ProcessEnv;

    expect(() => buildNavigationGraph({ env })).toThrowError(/must be a finite number/);
  });
});

describe("formatJourney", () => {
  it("renders a human readable summary", () => {
    const [journey] = simulateUserJourneys({
      userCount: 1,
      random: createSeededRandom(7),
    });

    const summary = formatJourney(journey);

    expect(summary).toContain(`User ${journey.id}`);
    expect(summary).toContain("loop at");
    expect(summary).toContain("[");
  });
});

describe("aggregateJourneyTransitions", () => {
  it("counts transitions across all journeys", () => {
    const journeys = simulateUserJourneys({
      userCount: 3,
      random: createSeededRandom(11),
    });

    const aggregates = aggregateJourneyTransitions(journeys);

    const transition = aggregates.find(
      (item) => item.from === "home" && item.to === "catalog",
    );

    expect(transition?.count).toBeGreaterThan(0);
    expect(aggregates).toMatchSnapshot();
  });

  it("returns an empty array when no journeys are provided", () => {
    expect(aggregateJourneyTransitions([])).toEqual([]);
  });
});

describe("validateJourneysHaveLoops", () => {
  it("throws when the journey list is empty", () => {
    expect(() => validateJourneysHaveLoops([])).toThrowError(/No journeys provided/);
  });

  it("throws when a journey finishes in a dead end", () => {
    const journey = simulateUserJourneys({ userCount: 1, random: createSeededRandom(3) })[0];
    const deadEndGraph: NavigationGraph = {
      ...navigationGraph,
      [journey.loopAt]: {
        ...navigationGraph[journey.loopAt],
        tokens: [],
      },
    };

    expect(() => validateJourneysHaveLoops([journey], deadEndGraph)).toThrowError(/dead end/);
  });
});
