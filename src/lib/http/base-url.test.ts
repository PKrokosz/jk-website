import { headers } from "next/headers";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getBaseUrl, resolveApiUrl } from "./base-url";

vi.mock("next/headers", () => ({
  headers: vi.fn()
}));

const mockedHeaders = vi.mocked(headers);

describe("getBaseUrl", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it("returns host and protocol from request headers", () => {
    const headersInstance = new Headers();
    headersInstance.set("x-forwarded-host", "jk.example");
    headersInstance.set("x-forwarded-proto", "https");
    mockedHeaders.mockReturnValue(headersInstance);

    expect(getBaseUrl()).toBe("https://jk.example");
  });

  it("falls back to environment url", () => {
    const headersInstance = new Headers();
    mockedHeaders.mockReturnValue(headersInstance);
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://jk.example");

    expect(getBaseUrl()).toBe("https://jk.example");
  });

  it("normalises environment domain without protocol", () => {
    const headersInstance = new Headers();
    mockedHeaders.mockReturnValue(headersInstance);
    vi.stubEnv("SITE_URL", "jk.example");

    expect(getBaseUrl()).toBe("https://jk.example");
  });

  it("returns localhost fallback when no data available", () => {
    const headersInstance = new Headers();
    mockedHeaders.mockReturnValue(headersInstance);

    expect(getBaseUrl()).toBe("http://localhost:3000");
  });
});

describe("resolveApiUrl", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it("joins the api path with the base url", () => {
    const headersInstance = new Headers();
    headersInstance.set("host", "localhost:3000");
    mockedHeaders.mockReturnValue(headersInstance);

    expect(resolveApiUrl("/api/test")).toBe("http://localhost:3000/api/test");
  });

  it("throws when path does not start with a slash", () => {
    const headersInstance = new Headers();
    headersInstance.set("host", "localhost:3000");
    mockedHeaders.mockReturnValue(headersInstance);

    expect(() => resolveApiUrl("api/test")).toThrow(
      "Ścieżka API musi rozpoczynać się od '/' "
    );
  });
});
