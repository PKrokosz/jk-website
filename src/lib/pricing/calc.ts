export interface PricingRequestOption {
  id: number | string;
  priceModGrosz?: number;
  label?: string;
}

export interface PricingRequest {
  styleId?: number;
  leatherId?: number;
  soleId?: number;
  basePriceGrosz?: number;
  baseLabel?: string;
  options?: PricingRequestOption[];
}

export interface PricingBreakdownItem {
  label: string;
  amountGrosz: number;
}

export interface PricingQuote {
  currency: "PLN";
  totalNetGrosz: number;
  totalVatGrosz: number;
  totalGrossGrosz: number;
  breakdown: PricingBreakdownItem[];
}

const VAT_RATE = 0.23;
const BASE_PRICE_GROSZ = 120_000; // 1200 PLN base price for custom pair
const DEFAULT_BASE_LABEL = "Bazowa para";

export function calculateQuote(request: PricingRequest = {}): PricingQuote {
  const basePrice = Math.max(0, request.basePriceGrosz ?? BASE_PRICE_GROSZ);
  const baseLabel = request.baseLabel ?? DEFAULT_BASE_LABEL;
  const options = request.options ?? [];

  const optionTotal = options.reduce((acc, option) => {
    return acc + Math.max(0, option.priceModGrosz ?? 0);
  }, 0);

  const net = basePrice + optionTotal;
  const vat = Math.round(net * VAT_RATE);
  const gross = net + vat;

  const breakdown: PricingBreakdownItem[] = [
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
