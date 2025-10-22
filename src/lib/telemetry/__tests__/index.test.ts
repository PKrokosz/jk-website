import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { reportClientError, reportServerError } from "../index";

describe("telemetry", () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it("dispatches a telemetry event in the browser without logging during tests", () => {
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");
    const consoleSpy = vi.spyOn(console, "error");

    reportClientError("contact:submit", new Error("Boom"), { status: 500 });

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "telemetry:error",
        detail: expect.objectContaining({
          scope: "client",
          event: "contact:submit",
          details: { status: 500 }
        })
      })
    );
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it("logs errors on the server side when not running tests", () => {
    process.env.NODE_ENV = "development";
    const consoleSpy = vi.spyOn(console, "error");

    reportServerError("api:pricing", "Unable to fetch pricing", { retry: true });

    expect(consoleSpy).toHaveBeenCalledWith(
      "[telemetry][server] api:pricing",
      expect.any(Error),
      { retry: true }
    );
  });

  it("normalizes string errors to Error instances", () => {
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");

    reportClientError("form:invalid", "Zły e-mail", {});

    const event = dispatchSpy.mock.calls[0]?.[0] as CustomEvent | undefined;
    expect(event?.detail?.error).toBeInstanceOf(Error);
    expect(event?.detail?.error.message).toBe("Zły e-mail");
  });
});
