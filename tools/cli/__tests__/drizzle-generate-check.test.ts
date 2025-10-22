import { execFile, spawn, type ChildProcess } from "node:child_process";
import { EventEmitter } from "node:events";
import { afterEach, describe, expect, it, vi } from "vitest";

const {
  DrizzleMigrationsOutOfSyncError,
  DrizzleMigrationsPendingGenerationError,
  ensureDrizzleMigrationsAreClean
} = await import("../drizzle-generate-check");

type DrizzleMigrationsOutOfSyncErrorInstance = InstanceType<
  typeof DrizzleMigrationsOutOfSyncError
>;
type DrizzleMigrationsPendingGenerationErrorInstance = InstanceType<
  typeof DrizzleMigrationsPendingGenerationError
>;

type SpawnFunction = typeof spawn;

const createSpawnMock = () => {
  const mock = vi.fn(
    (
      command: Parameters<SpawnFunction>[0],
      args?: Parameters<SpawnFunction>[1],
      options?: Parameters<SpawnFunction>[2]
    ) => {
      const child = new EventEmitter() as EventEmitter & ChildProcess;
      process.nextTick(() => {
        child.emit("exit", 0, null);
      });
      return child as ReturnType<SpawnFunction>;
    }
  );

  return {
    mock,
    impl: mock as unknown as SpawnFunction
  };
};

const createExecFileMock = (stdoutSequence: string[]) => {
  const outputs = [...stdoutSequence];
  const mock = vi.fn(
    (
      command: Parameters<typeof execFile>[0],
      args: Parameters<typeof execFile>[1],
      options: Parameters<typeof execFile>[2],
      callback: Parameters<typeof execFile>[3]
    ) => {
      const cb = (typeof options === "function" ? options : callback) as
        | ((error: NodeJS.ErrnoException | null, stdout: string, stderr: string) => void)
        | undefined;

      if (cb) {
        const next = outputs.shift() ?? "";
        cb(null, next, "");
      }

      return new EventEmitter() as unknown as ReturnType<typeof execFile>;
    }
  );

  const impl = Object.assign(mock, {
    __promisify__: execFile.__promisify__
  }) as unknown as typeof execFile;

  return { mock, impl };
};

describe("ensureDrizzleMigrationsAreClean", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uruchamia pnpm db:generate i przechodzi, gdy brak zmian", async () => {
    const { mock: spawnMock, impl: spawnImpl } = createSpawnMock();
    const { mock: execFileMock, impl: execFileImpl } = createExecFileMock(["", ""]);

    await expect(
      ensureDrizzleMigrationsAreClean({ spawnImpl, execFileImpl })
    ).resolves.toBeUndefined();

    expect(spawnMock).toHaveBeenCalledWith(
      "pnpm",
      ["db:generate"],
      expect.objectContaining({
        stdio: "inherit"
      })
    );
    expect(execFileMock).toHaveBeenNthCalledWith(
      1,
      "git",
      ["status", "--short", "drizzle"],
      { encoding: "utf8" },
      expect.any(Function)
    );
    expect(execFileMock).toHaveBeenNthCalledWith(
      2,
      "git",
      ["status", "--short", "drizzle"],
      { encoding: "utf8" },
      expect.any(Function)
    );
  });

  it("wyrzuca błąd, gdy katalog drizzle/ zawiera zmiany", async () => {
    const { mock: spawnMock, impl: spawnImpl } = createSpawnMock();
    const { mock: execFileMock, impl: execFileImpl } = createExecFileMock([" M drizzle/0001_pending.sql\n"]);

    await expect(
      ensureDrizzleMigrationsAreClean({ spawnImpl, execFileImpl })
    ).rejects.toBeInstanceOf(DrizzleMigrationsOutOfSyncError);

    expect(spawnMock).not.toHaveBeenCalled();

    const error = await ensureDrizzleMigrationsAreClean({
      spawnImpl,
      execFileImpl: createExecFileMock(["M drizzle/0001.sql\n"]).impl
    }).catch((caught) => caught);

    expect(error).toBeInstanceOf(DrizzleMigrationsOutOfSyncError);
    expect((error as DrizzleMigrationsOutOfSyncErrorInstance).statusOutput).toContain(
      "drizzle"
    );
  });

  it("informuje o brakujących migracjach, gdy generacja tworzy nowe pliki", async () => {
    const { impl: spawnImpl } = createSpawnMock();
    const { impl: execFileImpl } = createExecFileMock([
      "",
      "?? drizzle/0001_new.sql\n M drizzle/meta/_journal.json\n"
    ]);

    const error = await ensureDrizzleMigrationsAreClean({ spawnImpl, execFileImpl }).catch((caught) => caught);

    expect(error).toBeInstanceOf(DrizzleMigrationsPendingGenerationError);
    expect(
      (error as DrizzleMigrationsPendingGenerationErrorInstance).generatedArtifacts
    ).toEqual(["drizzle/0001_new.sql", "drizzle/meta/_journal.json"]);
  });
});
