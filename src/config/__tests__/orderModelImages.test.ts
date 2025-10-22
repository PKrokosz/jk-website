import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";

import { ORDER_MODELS } from "../orderModels";

const PLACEHOLDER_SUFFIX = "placeholder.svg";
const MODELS_WITH_REFERENCE_IMAGE = new Set([
  "szpic",
  "owal",
  "klamry",
  "wysokie-szpice",
  "krowie-pyski",
  "tamer",
  "wysokie-cholewy",
  "przelotka-na-sabatony",
  "trzewiki",
  "zakladki",
  "obiezyswiat",
  "obiezyswiat-szyta-warga",
  "dragonki",
  "wonderer",
  "kamienny-przodek",
  "wysokie-krowie-pyski"
]);

const modelsDirectory = join(process.cwd(), "public", "image", "models");

describe("ORDER_MODELS image assets", () => {
  it("uses reference photos for catalogued models", () => {
    for (const id of MODELS_WITH_REFERENCE_IMAGE) {
      const model = ORDER_MODELS.find((entry) => entry.id === id);
      expect(model, `Missing order model with id \"${id}\"`).toBeDefined();
      if (!model) {
        continue;
      }

      expect(model.image.endsWith(PLACEHOLDER_SUFFIX)).toBe(false);

      const filename = model.image.split("/").pop();
      expect(filename).toBeDefined();
      if (!filename) {
        continue;
      }

      expect(existsSync(join(modelsDirectory, filename))).toBe(true);
    }
  });

  it("never points to a missing asset when not using the placeholder", () => {
    for (const model of ORDER_MODELS) {
      if (model.image.endsWith(PLACEHOLDER_SUFFIX)) {
        continue;
      }

      const filename = model.image.split("/").pop();
      expect(filename).toBeDefined();
      if (!filename) {
        continue;
      }

      expect(existsSync(join(modelsDirectory, filename))).toBe(true);
    }
  });
});

