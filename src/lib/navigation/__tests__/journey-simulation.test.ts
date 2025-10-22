import { describe, expect, it } from "vitest";

import {
  buildNavigationGraph,
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

  it("throws when the JSON configuration is invalid", () => {
    const env = {
      NAVIGATION_WEIGHTS_JSON: "{not-valid",
    } satisfies NodeJS.ProcessEnv;

    expect(() => loadNavigationWeights({ env })).toThrowError(
      /invalid JSON/,
    );
  });

  it("throws when configuration references unknown nodes", () => {
    const env = {
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
