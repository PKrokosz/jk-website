import { EventEmitter } from "node:events";
import { execFile, spawn, type ChildProcess } from "node:child_process";
import { describe, expect, it, vi } from "vitest";

import {
  DrizzleMigrationsOutOfSyncError,
  ensureDrizzleMigrationsAreClean
} from "../drizzle-generate-check";

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
  it("uruchamia pnpm db:generate w trybie dry-run i przechodzi, gdy brak zmian", async () => {
    const { mock: spawnMock, impl: spawnImpl } = createSpawnMock();
    const { mock: execFileMock, impl: execFileImpl } = createExecFileMock("");

    await expect(
      ensureDrizzleMigrationsAreClean({ spawnImpl, execFileImpl })
    ).resolves.toBeUndefined();

    expect(spawnMock).toHaveBeenCalledWith(
      "pnpm",
      ["db:generate", "--", "--dry-run"],
      expect.objectContaining({ stdio: "inherit" })
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
    expect((error as DrizzleMigrationsOutOfSyncError).statusOutput).toContain("drizzle");
  });
});
