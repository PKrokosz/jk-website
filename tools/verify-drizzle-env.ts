#!/usr/bin/env tsx
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import {
  DEFAULT_ENV_SEQUENCE,
  loadCliEnvironment
} from "./cli/load-env";

type Logger = Pick<Console, "warn">;

type ComposeDatabaseConfig = {
  user: string;
  password: string;
  database: string;
  hostPort: string;
};

export type EnvRequirement = {
  name: string;
  description: string;
  example?: string;
  hint?: string;
};

export const REQUIRED_ENVIRONMENT_VARIABLES: EnvRequirement[] = [
  {
    name: "DATABASE_URL",
    description:
      "Connection string do lokalnej bazy Postgresa wykorzystywanej przez Drizzle.",
    example: "postgres://devuser:devpass@localhost:5432/jkdb",
    hint: "Zgodny z docker-compose.yml (serwis jkdb)."
  },
  {
    name: "NEXT_PUBLIC_ORDER_FORM_URL",
    description:
      "Adres osadzanego formularza zamówień widocznego na stronie /order.",
    example: "https://forms.gle/twoj-formularz",
    hint: "URL powinien być publiczny i wspierać osadzanie w iframe."
  },
  {
    name: "SMTP_HOST",
    description: "Host serwera SMTP używanego do wysyłki formularza kontaktowego.",
    example: "localhost",
    hint: "Dla MailHog pozostaw localhost i port 1025."
  },
  {
    name: "SMTP_PORT",
    description: "Port serwera SMTP (string).",
    example: "1025",
    hint: "MailHog domyślnie nasłuchuje na porcie 1025."
  },
  {
    name: "SMTP_USER",
    description: "Nazwa użytkownika SMTP.",
    example: "devuser",
    hint: "Dla narzędzi testowych często można zostawić pusty, ale CLI wymaga wartości."
  },
  {
    name: "SMTP_PASS",
    description: "Hasło użytkownika SMTP.",
    example: "devpass",
    hint: "W środowisku lokalnym ustaw umowną wartość, np. devpass."
  },
  {
    name: "MAIL_FROM",
    description: "Adres nadawcy wiadomości (format: Nazwa <email@domena>).",
    example: '"JK Handmade Footwear <kontakt@jkhandmade.pl>"',
    hint: "Adres powinien odpowiadać domenie z której wysyłasz e-maile."
  },
  {
    name: "MAIL_TO",
    description: "Adres skrzynki odbierającej zgłoszenia z formularza.",
    example: "kontakt@jkhandmade.pl",
    hint: "Może to być adres zespołu sprzedaży lub skrzynka testowa."
  }
];

const isValueMissing = (value: string | undefined): boolean =>
  (value ?? "").toString().trim().length === 0;

export const collectMissingRequirements = (
  requirements: EnvRequirement[],
  env: NodeJS.ProcessEnv
): EnvRequirement[] =>
  requirements.filter((requirement) => isValueMissing(env[requirement.name]));

const trimQuotes = (value: string): string => value.replace(/^['"](.*)['"]$/, "$1");

const sanitizeValue = (value: string | undefined): string | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return trimQuotes(value.trim());
};

export const parseDockerComposeDatabaseConfig = (
  composeContent: string
): ComposeDatabaseConfig | null => {
  const lines = composeContent.split(/\r?\n/);
  let inServicesSection = false;
  let inJkdbService = false;
  let environmentIndent: number | null = null;
  let portsIndent: number | null = null;
  const environment: Record<string, string> = {};
  let hostPort: string | null = null;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+#.*$/, "");
    if (line.trim().length === 0) {
      continue;
    }

    if (!inServicesSection) {
      if (/^services:\s*$/.test(line)) {
        inServicesSection = true;
      }
      continue;
    }

    const serviceMatch = line.match(/^(\s*)([A-Za-z0-9_-]+):\s*$/);
    if (serviceMatch) {
      const indent = serviceMatch[1].length;
      const name = serviceMatch[2];

      if (indent <= 2) {
        inJkdbService = name === "jkdb" && indent === 2;
        environmentIndent = null;
        portsIndent = null;
        continue;
      }
    }

    if (!inJkdbService) {
      continue;
    }

    const environmentSectionMatch = line.match(/^(\s*)environment:\s*$/);
    if (environmentSectionMatch) {
      environmentIndent = environmentSectionMatch[1].length;
      continue;
    }

    const portsSectionMatch = line.match(/^(\s*)ports:\s*$/);
    if (portsSectionMatch) {
      portsIndent = portsSectionMatch[1].length;
      continue;
    }

    if (environmentIndent !== null) {
      const indent = line.match(/^(\s*)/)?.[1].length ?? 0;
      if (indent <= environmentIndent) {
        environmentIndent = null;
      } else {
        const keyValueMatch = line.match(/^[\s-]*([A-Za-z0-9_]+):\s*(.+)?$/);
        if (keyValueMatch) {
          const key = keyValueMatch[1];
          const rawValue = keyValueMatch[2] ?? "";
          const value = sanitizeValue(rawValue);
          if (value !== undefined) {
            environment[key] = value;
          }
        }
        continue;
      }
    }

    if (portsIndent !== null) {
      const indent = line.match(/^(\s*)/)?.[1].length ?? 0;
      if (indent <= portsIndent) {
        portsIndent = null;
      } else {
        const portMatch = line.match(/^[\s-]*"?(\d+):(\d+)"?\s*$/);
        if (portMatch && hostPort === null) {
          hostPort = portMatch[1];
        }
        continue;
      }
    }
  }

  const user = sanitizeValue(environment.POSTGRES_USER);
  const password = sanitizeValue(environment.POSTGRES_PASSWORD);
  const database = sanitizeValue(environment.POSTGRES_DB);
  const port = sanitizeValue(hostPort ?? undefined) ?? "5432";

  if (!user || !password || !database) {
    return null;
  }

  return {
    user,
    password,
    database,
    hostPort: port
  };
};

export const buildDatabaseUrlFromComposeConfig = (
  config: ComposeDatabaseConfig,
  host = "localhost"
): string => {
  const username = encodeURIComponent(config.user);
  const password = encodeURIComponent(config.password);
  const database = encodeURIComponent(config.database);
  return `postgres://${username}:${password}@${host}:${config.hostPort}/${database}`;
};

export const extractDatabaseUrlFromEnvExample = (
  envExampleContent: string
): string | null => {
  const match = envExampleContent.match(/^\s*DATABASE_URL\s*=\s*(.+)$/m);
  return match ? match[1].trim() : null;
};

type DatabaseUrlComparison = {
  envDatabaseUrl: string | null;
  composeDatabaseUrl: string | null;
  matches: boolean | null;
};

export const compareDatabaseUrlWithCompose = (
  envExampleContent: string,
  composeContent: string
): DatabaseUrlComparison => {
  const envDatabaseUrl = extractDatabaseUrlFromEnvExample(envExampleContent);
  const composeConfig = parseDockerComposeDatabaseConfig(composeContent);
  const composeDatabaseUrl =
    composeConfig !== null
      ? buildDatabaseUrlFromComposeConfig(composeConfig)
      : null;

  if (!envDatabaseUrl || !composeDatabaseUrl) {
    return {
      envDatabaseUrl,
      composeDatabaseUrl,
      matches: null
    };
  }

  return {
    envDatabaseUrl,
    composeDatabaseUrl,
    matches: envDatabaseUrl === composeDatabaseUrl
  } as const;
};

export const warnOnDatabaseUrlMismatch = (
  envExamplePath = resolve(process.cwd(), ".env.example"),
  composePath = resolve(process.cwd(), "docker-compose.yml"),
  logger: Logger = console
) => {
  try {
    const envExampleContent = readFileSync(envExamplePath, "utf8");
    const composeContent = readFileSync(composePath, "utf8");
    const comparison = compareDatabaseUrlWithCompose(envExampleContent, composeContent);

    if (comparison.matches === false) {
      logger.warn(
        [
          "⚠️  DATABASE_URL w .env.example różni się od konfiguracji docker-compose (serwis jkdb).",
          `    .env.example : ${comparison.envDatabaseUrl}`,
          `    docker-compose: ${comparison.composeDatabaseUrl}`,
          "    Zaktualizuj plik, aby środowisko lokalne odpowiadało konfiguracji kontenera."
        ].join("\n")
      );
    }

    return comparison;
  } catch (error) {
    logger.warn(
      "⚠️  Nie udało się porównać DATABASE_URL z docker-compose.yml. Upewnij się, że oba pliki istnieją.",
      error
    );
    return {
      envDatabaseUrl: null,
      composeDatabaseUrl: null,
      matches: null
    };
  }
};

export const formatRequirementMessage = (requirement: EnvRequirement): string => {
  const lines = [`- ${requirement.name}: ${requirement.description}`];

  if (requirement.example) {
    lines.push(`  Przykład: ${requirement.example}`);
  }

  if (requirement.hint) {
    lines.push(`  Wskazówka: ${requirement.hint}`);
  }

  lines.push("  Dodaj wpis w .env.local i uruchom ponownie komendę.");

  return lines.join("\n");
};

export const verifyEnvironment = (
  requirements: EnvRequirement[] = REQUIRED_ENVIRONMENT_VARIABLES,
  env: NodeJS.ProcessEnv = process.env
) => {
  const missing = collectMissingRequirements(requirements, env);

  if (missing.length > 0) {
    console.error(
      "✗ Brakuje wymaganych zmiennych środowiskowych potrzebnych do Drizzle i integracji e-mailowych:\n"
    );
    missing.forEach((requirement) => {
      console.error(formatRequirementMessage(requirement));
      console.error("");
    });
    return { ok: false, missing } as const;
  }

  console.log(
    `✓ Wszystkie wymagane zmienne środowiskowe (${requirements.length}) są ustawione. Możesz kontynuować.`
  );

  return { ok: true, missing: [] as EnvRequirement[] } as const;
};

type LoadVerifyEnvEnvironmentOptions = {
  cwd?: string;
  sequence?: readonly string[];
  loader?: typeof loadCliEnvironment;
};

export const loadVerifyEnvEnvironment = (
  options: LoadVerifyEnvEnvironmentOptions = {}
) => {
  const {
    cwd = process.cwd(),
    sequence = DEFAULT_ENV_SEQUENCE,
    loader = loadCliEnvironment
  } = options;

  return loader({ cwd, files: sequence });
};

const run = () => {
  loadVerifyEnvEnvironment();
  warnOnDatabaseUrlMismatch();
  const result = verifyEnvironment();
  if (!result.ok) {
    process.exit(1);
  }
};

const executedFile = resolve(process.argv[1] ?? "");
const currentFile = fileURLToPath(import.meta.url);

if (executedFile === currentFile) {
  run();
}
