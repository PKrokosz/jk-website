import { z } from "zod";

export const pricingQuoteRequestOptionSchema = z
  .object({
    id: z.union([
      z
        .string()
        .trim()
        .min(1, "Identyfikator opcji nie może być pusty"),
      z
        .number({ invalid_type_error: "Identyfikator opcji musi być liczbą" })
        .int("Identyfikator opcji musi być liczbą całkowitą")
    ]),
    priceModGrosz: z
      .number({ invalid_type_error: "Modyfikator ceny musi być liczbą" })
      .int("Modyfikator ceny musi być liczbą całkowitą")
      .min(0, "Modyfikator ceny nie może być ujemny")
      .optional(),
    label: z
      .string({ invalid_type_error: "Etykieta musi być tekstem" })
      .trim()
      .min(1, "Etykieta nie może być pusta")
      .optional()
  })
  .strict();

export const pricingQuoteRequestSchema = z
  .object({
    styleId: z
      .number({ invalid_type_error: "styleId musi być liczbą" })
      .int("styleId musi być liczbą całkowitą")
      .positive("styleId musi być dodatni")
      .optional(),
    leatherId: z
      .number({ invalid_type_error: "leatherId musi być liczbą" })
      .int("leatherId musi być liczbą całkowitą")
      .positive("leatherId musi być dodatni")
      .optional(),
    soleId: z
      .number({ invalid_type_error: "soleId musi być liczbą" })
      .int("soleId musi być liczbą całkowitą")
      .positive("soleId musi być dodatni")
      .optional(),
    basePriceGrosz: z
      .number({ invalid_type_error: "Cena bazowa musi być liczbą" })
      .int("Cena bazowa musi być liczbą całkowitą")
      .min(0, "Cena bazowa nie może być ujemna")
      .optional(),
    baseLabel: z
      .string({ invalid_type_error: "Etykieta bazy musi być tekstem" })
      .trim()
      .min(1, "Etykieta bazy nie może być pusta")
      .optional(),
    options: z.array(pricingQuoteRequestOptionSchema).optional()
  })
  .strict();

export const pricingQuoteBreakdownItemSchema = z
  .object({
    label: z
      .string({ invalid_type_error: "Etykieta pozycji musi być tekstem" })
      .trim()
      .min(1, "Etykieta pozycji nie może być pusta"),
    amountGrosz: z
      .number({ invalid_type_error: "Kwota musi być liczbą" })
      .int("Kwota musi być liczbą całkowitą")
      .min(0, "Kwota nie może być ujemna")
  })
  .strict();

export const pricingQuoteSchema = z
  .object({
    currency: z.literal("PLN"),
    totalNetGrosz: z
      .number({ invalid_type_error: "Kwota netto musi być liczbą" })
      .int("Kwota netto musi być liczbą całkowitą")
      .min(0, "Kwota netto nie może być ujemna"),
    totalVatGrosz: z
      .number({ invalid_type_error: "Kwota VAT musi być liczbą" })
      .int("Kwota VAT musi być liczbą całkowitą")
      .min(0, "Kwota VAT nie może być ujemna"),
    totalGrossGrosz: z
      .number({ invalid_type_error: "Kwota brutto musi być liczbą" })
      .int("Kwota brutto musi być liczbą całkowitą")
      .min(0, "Kwota brutto nie może być ujemna"),
    breakdown: z.array(pricingQuoteBreakdownItemSchema).min(1)
  })
  .strict();

export const pricingQuoteResponseSchema = z
  .object({
    ok: z.literal(true),
    requestedAt: z.string().datetime(),
    payload: pricingQuoteRequestSchema,
    quote: pricingQuoteSchema
  })
  .strict();

export type PricingQuoteRequestOption = z.infer<typeof pricingQuoteRequestOptionSchema>;
export type PricingQuoteRequest = z.infer<typeof pricingQuoteRequestSchema>;
export type PricingQuoteBreakdownItem = z.infer<typeof pricingQuoteBreakdownItemSchema>;
export type PricingQuote = z.infer<typeof pricingQuoteSchema>;
export type PricingQuoteResponse = z.infer<typeof pricingQuoteResponseSchema>;
