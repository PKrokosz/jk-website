import { readFileSync as defaultReadFileSync } from "node:fs";
import { isAbsolute, resolve as resolvePath } from "node:path";

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

const BASE_NAVIGATION_GRAPH: NavigationGraph = {
  home: {
    id: "home",
    tokens: [
      {
        label: "Przejdź do katalogu",
        target: "catalog",
        confidence: "certain",
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
      },
      {
        label: "Zobacz katalog",
        target: "catalog",
        confidence: "uncertain",
      },
    ],
  },
};

export type NavigationWeightsConfig = Partial<
  Record<NavigationNodeId, Partial<Record<NavigationNodeId, number>>>
>;

export interface LoadNavigationWeightsOptions {
  env?: NodeJS.ProcessEnv;
  readFileSync?: (path: string, encoding: BufferEncoding) => string;
  baseDir?: string;
}

const NAVIGATION_WEIGHTS_JSON_ENV = "NAVIGATION_WEIGHTS_JSON";
const NAVIGATION_WEIGHTS_PATH_ENV = "NAVIGATION_WEIGHTS_PATH";

const assertIsNavigationNodeId = (
  value: string,
): asserts value is NavigationNodeId => {
  const isNode = value in BASE_NAVIGATION_GRAPH;
  if (!isNode) {
    throw new Error(`Unknown navigation node \"${value}\" in weights configuration`);
  }
};

const validateWeight = (node: NavigationNodeId, target: NavigationNodeId, weight: unknown): number => {
  if (typeof weight !== "number" || Number.isNaN(weight) || !Number.isFinite(weight)) {
    throw new Error(
      `Weight for transition ${node} -> ${target} must be a finite number, received ${String(weight)}`,
    );
  }

  if (weight <= 0) {
    throw new Error(`Weight for transition ${node} -> ${target} must be greater than 0`);
  }

  return weight;
};

const parseNavigationWeights = (
  raw: unknown,
  graph: NavigationGraph,
): NavigationWeightsConfig => {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("Navigation weights configuration must be an object");
  }

  const weights: NavigationWeightsConfig = {};

  for (const [nodeId, transitions] of Object.entries(raw)) {
    assertIsNavigationNodeId(nodeId);

    if (transitions === null || typeof transitions !== "object" || Array.isArray(transitions)) {
      throw new Error(`Transitions for node ${nodeId} must be an object of target weights`);
    }

    const nodeWeights: Partial<Record<NavigationNodeId, number>> = {};
    const availableTargets = new Set(graph[nodeId].tokens.map((token) => token.target));

    for (const [targetId, weight] of Object.entries(transitions)) {
      assertIsNavigationNodeId(targetId);

      if (!availableTargets.has(targetId)) {
        throw new Error(`Node ${nodeId} does not have a transition to ${targetId}`);
      }

      nodeWeights[targetId] = validateWeight(nodeId, targetId, weight);
    }

    weights[nodeId] = nodeWeights;
  }

  return weights;
};

export const loadNavigationWeights = ({
  env = process.env,
  readFileSync = defaultReadFileSync,
  baseDir = process.cwd(),
}: LoadNavigationWeightsOptions = {}): NavigationWeightsConfig => {
  const jsonConfig = env[NAVIGATION_WEIGHTS_JSON_ENV];
  const pathConfig = env[NAVIGATION_WEIGHTS_PATH_ENV];

  if (jsonConfig && pathConfig) {
    throw new Error(
      `Both ${NAVIGATION_WEIGHTS_JSON_ENV} and ${NAVIGATION_WEIGHTS_PATH_ENV} are set. Please choose only one source.`,
    );
  }

  if (!jsonConfig && !pathConfig) {
    return {};
  }

  try {
    const rawConfig = jsonConfig
      ? jsonConfig
      : readFileSync(
          isAbsolute(pathConfig as string)
            ? (pathConfig as string)
            : resolvePath(baseDir, pathConfig as string),
          "utf8",
        );

    const parsed = JSON.parse(rawConfig) as unknown;
    return parseNavigationWeights(parsed, BASE_NAVIGATION_GRAPH);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse navigation weights configuration: invalid JSON");
    }

    throw error instanceof Error
      ? error
      : new Error("Failed to load navigation weights configuration");
  }
};

export const applyNavigationWeights = (
  graph: NavigationGraph,
  weights: NavigationWeightsConfig,
): NavigationGraph => {
  const result: Partial<NavigationGraph> = {};

  for (const [nodeId, node] of Object.entries(graph) as [NavigationNodeId, NavigationNode][]) {
    const nodeWeights = weights[nodeId] ?? {};
    const updatedTokens = node.tokens.map((token) => {
      const override = nodeWeights[token.target];
      if (override !== undefined) {
        return {
          ...token,
          weight: override,
        } satisfies JourneyToken;
      }

      return token;
    });

    for (const targetId of Object.keys(nodeWeights)) {
      const transitionExists = updatedTokens.some((token) => token.target === targetId);
      if (!transitionExists) {
        throw new Error(`Node ${nodeId} does not have a transition to ${targetId}`);
      }
    }

    result[nodeId] = {
      ...node,
      tokens: updatedTokens,
    } satisfies NavigationNode;
  }

  for (const nodeId of Object.keys(weights)) {
    assertIsNavigationNodeId(nodeId);
    if (!(nodeId in graph)) {
      throw new Error(`Node ${nodeId} is not present in the navigation graph`);
    }
  }

  return result as NavigationGraph;
};

export const buildNavigationGraph = (
  options: LoadNavigationWeightsOptions & { weights?: NavigationWeightsConfig } = {},
): NavigationGraph => {
  const weightOverrides = options.weights ?? loadNavigationWeights(options);
  return applyNavigationWeights(BASE_NAVIGATION_GRAPH, weightOverrides);
};

export const navigationGraph = buildNavigationGraph();

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
