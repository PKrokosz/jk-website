import type {
  PricingQuote,
  PricingQuoteBreakdownItem,
  PricingQuoteRequest,
  PricingQuoteRequestOption
} from "./schemas";

const VAT_RATE = 0.23;
const BASE_PRICE_GROSZ = 120_000; // 1200 PLN base price for custom pair
const DEFAULT_BASE_LABEL = "Bazowa para";

export function calculateQuote(request: PricingQuoteRequest = {}): PricingQuote {
  const basePrice = Math.max(0, request.basePriceGrosz ?? BASE_PRICE_GROSZ);
  const baseLabel = request.baseLabel ?? DEFAULT_BASE_LABEL;
  const options = request.options ?? [];

  const optionTotal = options.reduce((acc, option) => {
    return acc + Math.max(0, option.priceModGrosz ?? 0);
  }, 0);

  const net = basePrice + optionTotal;
  const vat = Math.round(net * VAT_RATE);
  const gross = net + vat;

  const breakdown: PricingQuoteBreakdownItem[] = [
    {
      label: baseLabel,
      amountGrosz: basePrice
    }
  ];

  options.forEach((option) => {
    const amount = Math.max(0, option.priceModGrosz ?? 0);
    if (amount > 0) {
      breakdown.push({
        label: option.label ?? `Opcja ${String(option.id)}`,
        amountGrosz: amount
      });
    }
  });

  breakdown.push({ label: `VAT (${Math.round(VAT_RATE * 100)}%)`, amountGrosz: vat });

  return {
    currency: "PLN",
    totalNetGrosz: net,
    totalVatGrosz: vat,
    totalGrossGrosz: gross,
    breakdown
  };
}

export type {
  PricingQuote,
  PricingQuoteBreakdownItem,
  PricingQuoteRequest as PricingRequest,
  PricingQuoteRequestOption as PricingRequestOption
} from "./schemas";
