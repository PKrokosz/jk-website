export interface PricingRequest {
  styleId?: number;
  leatherId?: number;
  soleId?: number;
  options?: Array<{ id: number; priceModGrosz?: number }>;
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

export function calculateQuote(request: PricingRequest = {}): PricingQuote {
  const optionTotal = (request.options ?? []).reduce((acc, option) => {
    return acc + Math.max(0, option.priceModGrosz ?? 0);
  }, 0);

  const net = BASE_PRICE_GROSZ + optionTotal;
  const vat = Math.round(net * VAT_RATE);
  const gross = net + vat;

  const breakdown: PricingBreakdownItem[] = [
    {
      label: "Bazowa para",
      amountGrosz: BASE_PRICE_GROSZ
    }
  ];

  if (optionTotal > 0) {
    breakdown.push({ label: "Dodatkowe opcje", amountGrosz: optionTotal });
  }

  breakdown.push({ label: "VAT (23%)", amountGrosz: vat });

  return {
    currency: "PLN",
    totalNetGrosz: net,
    totalVatGrosz: vat,
    totalGrossGrosz: gross,
    breakdown
  };
}
