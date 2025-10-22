import { describe, expect, it } from "vitest";

import { privacyPolicySections } from "@/lib/legal/privacy-policy";
import { termsSections } from "@/lib/legal/terms";

const hasContent = (segmentCount: number) => segmentCount > 0;

describe("privacy policy sections", () => {
  it("includes all required sections", () => {
    const ids = privacyPolicySections.map((section) => section.id);

    expect(ids).toEqual([
      "privacy-policy-admin",
      "privacy-policy-scope",
      "privacy-policy-data-types",
      "privacy-policy-obligation",
      "privacy-policy-recipients",
      "privacy-policy-transfers",
      "privacy-policy-retention",
      "privacy-policy-rights",
      "privacy-policy-complaint",
      "privacy-policy-cookies",
      "privacy-policy-security",
      "privacy-policy-changes",
      "privacy-policy-contact"
    ]);
  });

  it("defines non-empty content for every block", () => {
    for (const section of privacyPolicySections) {
      expect(section.blocks.length).toBeGreaterThan(0);

      for (const block of section.blocks) {
        if (block.type === "paragraph") {
          expect(hasContent(block.content.length)).toBe(true);
        } else {
          expect(block.items.length).toBeGreaterThan(0);
          for (const item of block.items) {
            expect(hasContent(item.length)).toBe(true);
          }
        }
      }
    }
  });
});

describe("terms sections", () => {
  it("includes all required sections", () => {
    const ids = termsSections.map((section) => section.id);

    expect(ids).toEqual([
      "terms-general",
      "terms-definitions",
      "terms-services",
      "terms-orders",
      "terms-payment",
      "terms-delivery",
      "terms-withdrawal",
      "terms-complaints",
      "terms-liability",
      "terms-privacy",
      "terms-final",
      "terms-disclaimer"
    ]);
  });

  it("defines non-empty content for every block", () => {
    for (const section of termsSections) {
      expect(section.blocks.length).toBeGreaterThan(0);

      for (const block of section.blocks) {
        if (block.type === "paragraph") {
          expect(hasContent(block.content.length)).toBe(true);
        } else {
          expect(block.items.length).toBeGreaterThan(0);
          for (const item of block.items) {
            expect(hasContent(item.length)).toBe(true);
          }
        }
      }
    }
  });
});
