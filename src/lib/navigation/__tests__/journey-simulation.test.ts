import { describe, expect, it } from "vitest";

import {
  formatJourney,
  navigationGraph,
  simulateUserJourneys,
  validateJourneysHaveLoops,
} from "../journey-simulation";
import type { NavigationGraph } from "../journey-simulation";

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
