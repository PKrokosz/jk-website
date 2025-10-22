import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { getMarketingScripts } from "../scripts";

type EnvKey =
  | "NEXT_PUBLIC_GTM_ID"
  | "NEXT_PUBLIC_META_PIXEL_ID"
  | "NEXT_PUBLIC_LINKEDIN_PARTNER_ID";

const envKeys: EnvKey[] = [
  "NEXT_PUBLIC_GTM_ID",
  "NEXT_PUBLIC_META_PIXEL_ID",
  "NEXT_PUBLIC_LINKEDIN_PARTNER_ID"
];

describe("getMarketingScripts", () => {
  const baselineEnv: Partial<Record<EnvKey, string | undefined>> = {};

  beforeAll(() => {
    envKeys.forEach((key) => {
      baselineEnv[key] = process.env[key];
    });
  });

  beforeEach(() => {
    envKeys.forEach((key) => {
      delete process.env[key];
    });
  });

  afterEach(() => {
    envKeys.forEach((key) => {
      const value = baselineEnv[key];
      if (typeof value === "string") {
        process.env[key] = value;
      } else {
        delete process.env[key];
      }
    });
  });

  it("returns an empty array when no identifiers are configured", () => {
    expect(getMarketingScripts()).toEqual([]);
  });

  it("creates scripts for each configured marketing integration", () => {
    process.env.NEXT_PUBLIC_GTM_ID = "GTM-XXXX";
    process.env.NEXT_PUBLIC_META_PIXEL_ID = "123456789";
    process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID = "987654";

    const scripts = getMarketingScripts();

    const ids = scripts.map((script) => script.id);
    expect(ids).toContain("gtm-inline");
    expect(ids).toContain("fb-pixel");
    expect(ids).toContain("linkedin-insight");

    const gtmScript = scripts.find((script) => script.id === "gtm-inline");
    expect(gtmScript?.noScriptFallback).toContain("GTM-XXXX");
    expect(gtmScript?.attributes?.["data-privacy-policy-url"]).toBe("/privacy-policy");

    const pixelScript = scripts.find((script) => script.id === "fb-pixel");
    expect(pixelScript?.noScriptFallback).toContain("123456789");
    expect(pixelScript?.attributes?.["data-meta-pixel-id"]).toBe("123456789");

    const linkedinScript = scripts.find((script) => script.id === "linkedin-insight");
    expect(linkedinScript?.noScriptFallback).toBeUndefined();
    expect(linkedinScript?.attributes?.["data-linkedin-partner-id"]).toBe("987654");
  });
});
