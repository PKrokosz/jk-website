import { describe, expect, it, vi } from "vitest";

import type { DotenvConfigOptions, DotenvConfigOutput } from "dotenv";

import { loadCliEnvironment, DEFAULT_ENV_SEQUENCE } from "../load-env";

const createMocks = () => {
  const load = vi.fn<(options: DotenvConfigOptions) => DotenvConfigOutput>();
  const exists = vi.fn<(path: string) => boolean>();
  load.mockReturnValue({ parsed: {} });

  return { load, exists };
};

describe("loadCliEnvironment", () => {
  it("loads environment files that exist in order", () => {
    const { load, exists } = createMocks();
    exists.mockImplementation(
      (path) => path.endsWith(".env.local") || path.endsWith(".env.example")
    );

    const loaded = loadCliEnvironment({
      cwd: "/repo",
      files: [".env.local", ".env", ".env.example"],
      load,
      exists
    });

    expect(load).toHaveBeenCalledTimes(2);
    expect(load).toHaveBeenNthCalledWith(1, {
      path: "/repo/.env.local",
      override: false
    });
    expect(load).toHaveBeenNthCalledWith(2, {
      path: "/repo/.env.example",
      override: false
    });
    expect(loaded).toEqual(["/repo/.env.local", "/repo/.env.example"]);
  });

  it("skips files that do not exist", () => {
    const { load, exists } = createMocks();
    exists.mockReturnValue(false);

    const loaded = loadCliEnvironment({
      cwd: "/repo",
      load,
      exists
    });

    expect(load).not.toHaveBeenCalled();
    expect(loaded).toEqual([]);
  });

  it("throws when a file fails to load", () => {
    const { load, exists } = createMocks();
    exists.mockReturnValue(true);
    const error = new Error("parse error");
    load.mockReturnValue({ error });

    expect(() =>
      loadCliEnvironment({ cwd: "/repo", files: [".env.local"], load, exists })
    ).toThrow(/\.env\.local/);
  });
});

describe("DEFAULT_ENV_SEQUENCE", () => {
  it("lists .env.local, .env and .env.example in order", () => {
    expect(DEFAULT_ENV_SEQUENCE).toEqual([".env.local", ".env", ".env.example"]);
  });
});
