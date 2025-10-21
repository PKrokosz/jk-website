const DEFAULT_ORDER_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdpPdbrzFCc6EN3TgaocfSCvo-uKRNxqTNJqqsV-HeypWuaMw/viewform?embedded=true";

const normalizeEnvValue = (value: string | undefined) => value?.trim() ?? "";

const envValue = normalizeEnvValue(process.env.NEXT_PUBLIC_ORDER_FORM_URL);

export const ORDER_FORM_URL = envValue.length > 0 ? envValue : DEFAULT_ORDER_FORM_URL;
