import { execFile, spawn, type ChildProcess } from "node:child_process";
import { EventEmitter } from "node:events";
import { afterEach, describe, expect, it, vi } from "vitest";

const {
  DrizzleMigrationsOutOfSyncError,
  DrizzleMigrationsPendingGenerationError,
  ensureDrizzleMigrationsAreClean
} = await import("../drizzle-generate-check");

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

const createExecFileMock = (stdout: string) => {
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
        cb(null, stdout, "");
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

  it("uruchamia pnpm db:generate w trybie dry-run i przechodzi, gdy brak zmian", async () => {
    const { mock: spawnMock, impl: spawnImpl } = createSpawnMock();
    const { mock: execFileMock, impl: execFileImpl } = createExecFileMock("");

    await expect(
      ensureDrizzleMigrationsAreClean({ spawnImpl, execFileImpl })
    ).resolves.toBeUndefined();

    expect(spawnMock).toHaveBeenCalledWith(
      "pnpm",
      ["db:generate"],
      expect.objectContaining({
        stdio: "inherit",
        env: expect.not.objectContaining({ DRIZZLE_OUT: expect.any(String) })
      })
    );
    expect(execFileMock).toHaveBeenCalledWith(
      "git",
      ["status", "--short", "drizzle"],
      { encoding: "utf8" },
      expect.any(Function)
    );
  });

  it("wyrzuca błąd, gdy katalog drizzle/ zawiera zmiany", async () => {
    const { mock: spawnMock, impl: spawnImpl } = createSpawnMock();
    const { mock: execFileMock, impl: execFileImpl } = createExecFileMock(" M drizzle/0001_pending.sql\n");

    await expect(
      ensureDrizzleMigrationsAreClean({ spawnImpl, execFileImpl })
    ).rejects.toBeInstanceOf(DrizzleMigrationsOutOfSyncError);

    const error = await ensureDrizzleMigrationsAreClean({
      spawnImpl,
      execFileImpl: createExecFileMock("M drizzle/0001.sql\n").impl
    }).catch((caught) => caught);

    expect(error).toBeInstanceOf(DrizzleMigrationsOutOfSyncError);

    if (!(error instanceof DrizzleMigrationsOutOfSyncError)) {
      throw error;
    }

    expect(error.statusOutput).toContain("drizzle");
  });

  it("informuje o brakujących migracjach, gdy generacja tworzy nowe pliki", async () => {
    const { impl: spawnImpl } = createSpawnMock();
    const { impl: execFileImpl } = createExecFileMock(
      "?? drizzle/0001_new.sql\n?? drizzle/meta/0001_snapshot.json\n"
    );

    const error = await ensureDrizzleMigrationsAreClean({ spawnImpl, execFileImpl }).catch((caught) => caught);

    expect(error).toBeInstanceOf(DrizzleMigrationsPendingGenerationError);

    if (!(error instanceof DrizzleMigrationsPendingGenerationError)) {
      throw error;
    }

    expect(error.generatedArtifacts).toEqual([
      "drizzle/0001_new.sql",
      "drizzle/meta/0001_snapshot.json"
    ]);
  });
});
