export function sanitizeProductQuery(
  value: string | string[] | null | undefined
): string {
  if (!value) {
    return "";
  }

  const normalized = Array.isArray(value) ? value[0] ?? "" : value;

  return normalized
    .replace(/[\u0000-\u001F\u007F]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}
