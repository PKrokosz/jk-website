import { describe, expect, it, vi } from "vitest";

import { GET } from "./route";

describe("GET /healthz", () => {
  it("returns current time and ok flag", async () => {
    vi.useFakeTimers();
    const now = new Date("2024-01-01T10:15:30.000Z");
    vi.setSystemTime(now);

    try {
      const response = GET();

      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain("application/json");

      const body = await response.json();
      expect(body).toEqual({ ok: true, time: now.toISOString() });
    } finally {
      vi.useRealTimers();
    }
  });
});
