import { headers } from "next/headers";

function resolveEnvUrl(): string | null {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.SITE_URL,
    process.env.APP_URL,
    process.env.VERCEL_URL
  ];

  for (const candidate of candidates) {
    if (candidate && candidate.trim().length > 0) {
      if (candidate.startsWith("http://") || candidate.startsWith("https://")) {
        return candidate;
      }

      return `https://${candidate}`;
    }
  }

  return null;
}

export function getBaseUrl(): string {
  try {
    const requestHeaders = headers();
    const host =
      requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

    if (host) {
      const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
      return `${protocol}://${host}`;
    }
  } catch (error) {
    // Ignored — occurs during static generation when request headers are unavailable.
  }

  const envUrl = resolveEnvUrl();
  if (envUrl) {
    return envUrl;
  }

  return "http://localhost:3000";
}

export function resolveApiUrl(path: string): string {
  if (!path.startsWith("/")) {
    throw new Error("Ścieżka API musi rozpoczynać się od '/' ");
  }

  return new URL(path, getBaseUrl()).toString();
}
