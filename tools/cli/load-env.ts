import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { config as loadEnv } from "dotenv";

import type { DotenvConfigOptions, DotenvConfigOutput } from "dotenv";

type LoadFunction = (options: DotenvConfigOptions) => DotenvConfigOutput;

type ExistsFunction = (path: string) => boolean;

const DEFAULT_ENV_FILES = [".env.local", ".env", ".env.example"] as const;

export type LoadCliEnvironmentOptions = {
  cwd?: string;
  files?: readonly string[];
  load?: LoadFunction;
  exists?: ExistsFunction;
};

export const loadCliEnvironment = (
  options: LoadCliEnvironmentOptions = {}
): string[] => {
  const cwd = options.cwd ?? process.cwd();
  const files = options.files ?? DEFAULT_ENV_FILES;
  const load: LoadFunction = options.load ?? loadEnv;
  const exists: ExistsFunction = options.exists ?? existsSync;

  const loadedPaths: string[] = [];

  for (const file of files) {
    const absolutePath = resolve(cwd, file);

    if (!exists(absolutePath)) {
      continue;
    }

    const result = load({ path: absolutePath, override: false });

    if (result?.error) {
      throw new Error(`Nie udało się wczytać pliku środowiskowego ${file}.`, {
        cause: result.error
      });
    }

    loadedPaths.push(absolutePath);
  }

  return loadedPaths;
};

export const DEFAULT_ENV_SEQUENCE = [...DEFAULT_ENV_FILES];
