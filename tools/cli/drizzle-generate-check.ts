import { execFile, spawn } from "node:child_process";

type SpawnFunction = typeof spawn;

export class DrizzleMigrationsOutOfSyncError extends Error {
  constructor(public readonly statusOutput: string) {
    super(
      "::error::Wykryto niezatwierdzone zmiany w katalogu drizzle/. Uruchom `pnpm db:generate` i dodaj wygenerowane migracje do commita."
    );
    this.name = "DrizzleMigrationsOutOfSyncError";
  }
}

export interface RunOptions {
  spawnImpl?: SpawnFunction;
  execFileImpl?: typeof execFile;
}

const runCommand = (command: string, args: string[], spawnImpl: SpawnFunction): Promise<void> =>
  new Promise((resolve, reject) => {
    const child = spawnImpl(command, args, {
      stdio: "inherit",
      shell: false,
      env: process.env
    });

    if (!child || typeof child.once !== "function") {
      reject(new Error("Spawned process does not expose an EventEmitter-compatible interface."));
      return;
    }

    child.once("error", (error) => {
      reject(error);
    });

    child.once("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      const reason = signal ? `terminated by signal ${signal}` : `exited with code ${code ?? "unknown"}`;
      reject(new Error(`Command ${command} ${args.join(" ")} ${reason}`));
    });
  });

const getDrizzleStatus = (
  execFileImpl: typeof execFile
): Promise<{ stdout: string; stderr: string }> =>
  new Promise((resolve, reject) => {
    execFileImpl(
      "git",
      ["status", "--short", "drizzle"],
      { encoding: "utf8" },
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({ stdout, stderr });
      }
    );
  });

export const ensureDrizzleMigrationsAreClean = async ({
  spawnImpl = spawn,
  execFileImpl = execFile
}: RunOptions = {}): Promise<void> => {
  await runCommand("pnpm", ["db:generate", "--", "--dry-run"], spawnImpl);

  const { stdout } = await getDrizzleStatus(execFileImpl);
  if (stdout.trim().length > 0) {
    throw new DrizzleMigrationsOutOfSyncError(stdout);
  }
};

export const main = async (): Promise<void> => {
  try {
    await ensureDrizzleMigrationsAreClean();
  } catch (error) {
    if (error instanceof DrizzleMigrationsOutOfSyncError) {
      console.error(error.message);
      if (error.statusOutput.trim().length > 0) {
        console.error(error.statusOutput.trim());
      }
      process.exit(1);
    }

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(String(error));
    }
    process.exit(1);
  }
};

if (process.env.CLI_TEST_MODE !== "1") {
  void main();
}
