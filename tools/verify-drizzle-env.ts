#!/usr/bin/env tsx
import { resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

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

const run = () => {
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
