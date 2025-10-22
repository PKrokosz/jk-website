import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

interface PageModuleExports {
  default: unknown;
  metadata?: unknown;
}

const pageModuleLoaders = import.meta.glob<PageModuleExports>("../**/page.tsx");

describe("App Router page modules", () => {
  const entries = Object.entries(pageModuleLoaders);

  it("covers at least one page module", () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  it.each(entries)("compiles %s", async (relativePath, loader) => {
    const moduleExports = await loader();

    expect(moduleExports).toBeDefined();
    expect(moduleExports.default).toBeDefined();
    expect(typeof moduleExports.default === "function").toBe(true);

    if (Object.prototype.hasOwnProperty.call(moduleExports, "metadata")) {
      expect(moduleExports.metadata).toBeDefined();
    }
  });
});
