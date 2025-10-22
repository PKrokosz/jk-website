export type NavigationNodeId =
  | "home"
  | "catalog"
  | "product"
  | "orderNative"
  | "order"
  | "contact"
  | "about"
  | "groupOrders";

export type ConfidenceLevel = "certain" | "uncertain";

export interface JourneyToken {
  label: string;
  target: NavigationNodeId;
  confidence: ConfidenceLevel;
  weight?: number;
}

export interface NavigationNode {
  id: NavigationNodeId;
  tokens: JourneyToken[];
}

export type NavigationGraph = Record<NavigationNodeId, NavigationNode>;

export interface JourneyStep {
  from: NavigationNodeId;
  to: NavigationNodeId;
  token: JourneyToken;
}

export interface UserJourney {
  id: number;
  start: NavigationNodeId;
  steps: JourneyStep[];
  loopDetected: boolean;
  loopAt: NavigationNodeId;
}

export interface SimulationOptions {
  userCount?: number;
  graph?: NavigationGraph;
  random?: () => number;
  startNode?: NavigationNodeId;
  maxSteps?: number;
}

const DEFAULT_MAX_STEPS = 12;

const DEFAULT_NAVIGATION_GRAPH: NavigationGraph = {
  home: {
    id: "home",
    tokens: [
      {
        label: "Przejdź do katalogu",
        target: "catalog",
        confidence: "certain",
        weight: 3,
      },
      {
        label: "Nawiąż kontakt",
        target: "contact",
        confidence: "uncertain",
      },
      {
        label: "Poznaj historię marki",
        target: "about",
        confidence: "uncertain",
      },
    ],
  },
  catalog: {
    id: "catalog",
    tokens: [
      {
        label: "Wybierz model produktu",
        target: "product",
        confidence: "certain",
        weight: 3,
      },
      {
        label: "Wróć na stronę główną",
        target: "home",
        confidence: "uncertain",
      },
      {
        label: "Sprawdź ofertę grupową",
        target: "groupOrders",
        confidence: "uncertain",
      },
    ],
  },
  product: {
    id: "product",
    tokens: [
      {
        label: "Przejdź do zamówienia natywnego",
        target: "orderNative",
        confidence: "certain",
        weight: 3,
      },
      {
        label: "Zadaj pytanie",
        target: "contact",
        confidence: "uncertain",
      },
      {
        label: "Analizuj inne modele",
        target: "catalog",
        confidence: "uncertain",
      },
    ],
  },
  orderNative: {
    id: "orderNative",
    tokens: [
      {
        label: "Otwórz pełny formularz zamówienia",
        target: "order",
        confidence: "certain",
        weight: 3,
      },
      {
        label: "Porównaj modele",
        target: "catalog",
        confidence: "uncertain",
      },
    ],
  },
  order: {
    id: "order",
    tokens: [
      {
        label: "Powrót na stronę główną",
        target: "home",
        confidence: "certain",
        weight: 3,
      },
      {
        label: "Skontaktuj się z doradcą",
        target: "contact",
        confidence: "uncertain",
      },
    ],
  },
  contact: {
    id: "contact",
    tokens: [
      {
        label: "Wróć na stronę główną",
        target: "home",
        confidence: "certain",
        weight: 3,
      },
      {
        label: "Przeglądaj katalog",
        target: "catalog",
        confidence: "uncertain",
      },
    ],
  },
  about: {
    id: "about",
    tokens: [
      {
        label: "Nawiąż kontakt",
        target: "contact",
        confidence: "certain",
        weight: 2,
      },
      {
        label: "Sprawdź katalog",
        target: "catalog",
        confidence: "uncertain",
      },
    ],
  },
  groupOrders: {
    id: "groupOrders",
    tokens: [
      {
        label: "Umów konsultację",
        target: "contact",
        confidence: "certain",
        weight: 2,
      },
      {
        label: "Zobacz katalog",
        target: "catalog",
        confidence: "uncertain",
      },
    ],
  },
};

export const navigationGraph = DEFAULT_NAVIGATION_GRAPH;

type WeightedToken = JourneyToken & { weight: number };

const resolveWeight = (token: JourneyToken): WeightedToken => ({
  ...token,
  weight:
    token.weight ??
    (token.confidence === "certain"
      ? 3
      : 1),
});

const pickToken = (
  tokens: JourneyToken[],
  random: () => number,
): JourneyToken => {
  if (tokens.length === 0) {
    throw new Error("Node without outgoing tokens detected");
  }

  const weighted = tokens.map(resolveWeight);
  const totalWeight = weighted.reduce((acc, token) => acc + token.weight, 0);
  const draw = random() * totalWeight;
  let cumulative = 0;

  for (const token of weighted) {
    cumulative += token.weight;
    if (draw <= cumulative) {
      return token;
    }
  }

  return weighted[weighted.length - 1];
};

const simulateSingleJourney = (
  id: number,
  graph: NavigationGraph,
  random: () => number,
  start: NavigationNodeId,
  maxSteps: number,
): UserJourney => {
  const steps: JourneyStep[] = [];
  const visited = new Set<NavigationNodeId>([start]);
  let currentNode = start;

  for (let stepIndex = 0; stepIndex < maxSteps; stepIndex += 1) {
    const node = graph[currentNode];

    if (!node) {
      throw new Error(`Node \"${currentNode}\" is missing in the navigation graph`);
    }

    const nextToken = pickToken(node.tokens, random);
    const nextNode = nextToken.target;

    steps.push({
      from: currentNode,
      to: nextNode,
      token: nextToken,
    });

    if (visited.has(nextNode)) {
      return {
        id,
        start,
        steps,
        loopDetected: true,
        loopAt: nextNode,
      };
    }

    visited.add(nextNode);
    currentNode = nextNode;
  }

  throw new Error(
    `Failed to create a loop for user ${id} within ${maxSteps} steps. Consider increasing maxSteps or review the graph.`,
  );
};

export const simulateUserJourneys = ({
  userCount = 20,
  graph = navigationGraph,
  random = Math.random,
  startNode = "home",
  maxSteps = DEFAULT_MAX_STEPS,
}: SimulationOptions = {}): UserJourney[] => {
  return Array.from({ length: userCount }, (_, index) =>
    simulateSingleJourney(index + 1, graph, random, startNode, maxSteps),
  );
};

export const validateJourneysHaveLoops = (
  journeys: UserJourney[],
  graph: NavigationGraph = navigationGraph,
): void => {
  if (journeys.length === 0) {
    throw new Error("No journeys provided for validation");
  }

  journeys.forEach((journey) => {
    if (!journey.loopDetected) {
      throw new Error(`Journey ${journey.id} does not contain a loop`);
    }

    const lastStep = journey.steps[journey.steps.length - 1];
    const loopNode = lastStep?.to ?? journey.start;
    const node = graph[loopNode];

    if (!node || node.tokens.length === 0) {
      throw new Error(`Journey ${journey.id} finished in a dead end at node ${loopNode}`);
    }
  });
};

export const formatJourney = (journey: UserJourney): string => {
  const stepsDescription = journey.steps
    .map(
      (step) =>
        `${step.from} -[${step.token.label} (${step.token.confidence})]-> ${step.to}`,
    )
    .join(" \u2192 ");

  return `User ${journey.id}: ${stepsDescription} | loop at ${journey.loopAt}`;
};
