import path from "node:path";
import { fileURLToPath } from "node:url";

import type {} from "@vitest/coverage-v8";
import { defineConfig } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    coverage: {
      reporter: ["text", "lcov"],
      provider: "v8"
    }
  }
});
