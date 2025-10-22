import path from "node:path";
import { fileURLToPath } from "node:url";

import type {} from "@vitest/coverage-v8";
import { defineConfig } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@jk/db": path.resolve(__dirname, "packages/db/src"),
      "server-only": path.resolve(__dirname, "test/__mocks__/server-only.ts")
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    environmentMatchGlobs: [["**/tools/**", "node"]],
    setupFiles: "./vitest.setup.ts",
    exclude: ["node_modules/**", "src/tests/e2e/**"],
    coverage: {
      reporter: ["text", "lcov"],
      provider: "v8"
    }
  }
});
