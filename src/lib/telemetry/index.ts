export type TelemetryDetails = Record<string, unknown>;

function toError(error: unknown) {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === "string") {
    return new Error(error);
  }

  return new Error("Unknown error");
}

function safeLog(...args: unknown[]) {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  console.error(...args);
}

export function reportClientError(
  event: string,
  error: unknown,
  details: TelemetryDetails = {}
) {
  const parsedError = toError(error);

  safeLog(`[telemetry][client] ${event}`, parsedError, details);

  if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
    const detail = {
      scope: "client" as const,
      event,
      error: parsedError,
      details
    };

    window.dispatchEvent(new CustomEvent("telemetry:error", { detail }));
  }
}

export function reportServerError(
  event: string,
  error: unknown,
  details: TelemetryDetails = {}
) {
  const parsedError = toError(error);

  safeLog(`[telemetry][server] ${event}`, parsedError, details);
}
