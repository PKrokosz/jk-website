import { z } from "zod";

import { ORDER_ACCESSORIES } from "@/config/orderAccessories";
import { ORDER_COLOR_IDS, ORDER_COLORS, ORDER_SIZE_IDS, ORDER_SIZES } from "@/config/orderOptions";
import { ORDER_MODEL_MAP, ORDER_MODELS } from "@/config/orderModels";

const measurementSchema = (required: boolean) =>
  z.preprocess((value) => {
    if (typeof value === "number") {
      return value;
    }

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed.length === 0) {
        return required ? value : undefined;
      }

      const normalized = trimmed.replace(",", ".");
      const parsed = Number(normalized);
      return Number.isNaN(parsed) ? value : parsed;
    }

    return value;
  },
  required
    ? z.number({ invalid_type_error: "Podaj liczbę" }).positive("Wartość musi być dodatnia")
    : z
        .number({ invalid_type_error: "Podaj liczbę" })
        .positive("Wartość musi być dodatnia")
        .optional());

const requiredMeasurement = measurementSchema(true);
const optionalMeasurement = measurementSchema(false);

const colorEnum = z.enum(ORDER_COLOR_IDS as [string, ...string[]]);
const sizeEnum = z.enum(ORDER_SIZE_IDS as [string, ...string[]]);

const accessoryIds = ORDER_ACCESSORIES.map((accessory) => accessory.id);

export const orderFormSchema = z
  .object({
    fullName: z.string().trim().min(1, "Wpisz imię i nazwisko"),
    phoneNumber: z.string().trim().min(1, "Podaj numer telefonu"),
    parcelLockerCode: z.string().trim().min(1, "Podaj kod paczkomatu"),
    email: z.string().trim().email("Podaj poprawny adres e-mail"),
    footLength: requiredMeasurement,
    instepCircumference: requiredMeasurement,
    calfCircumference: optionalMeasurement,
    modelId: z.string().min(1, "Wybierz model"),
    color: colorEnum,
    size: sizeEnum,
    accessories: z.array(z.string()).default([]),
    waterskin: z.object({
      selected: z.boolean(),
      symbol: z.string().optional()
    }),
    bracer: z.object({
      selected: z.boolean(),
      color: z.string().optional()
    }),
    shoeTrees: z.boolean(),
    discountCode: z.string().optional(),
    notes: z.string().optional()
  })
  .superRefine((values, ctx) => {
    const model = ORDER_MODEL_MAP[values.modelId];
    if (!model) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Wybierz model z listy",
        path: ["modelId"]
      });
    }

    if (model?.requiresCalfMeasurement && !values.calfCircumference) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Podaj obwód łydki dla wybranych modeli",
        path: ["calfCircumference"]
      });
    }

    values.accessories.forEach((accessoryId, index) => {
      if (!accessoryIds.includes(accessoryId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Nieprawidłowe akcesorium",
          path: ["accessories", index]
        });
      }
    });

    if (values.waterskin.symbol && values.waterskin.symbol.trim().length > 200) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Opis symbolu może mieć maksymalnie 200 znaków",
        path: ["waterskin", "symbol"]
      });
    }

    if (values.bracer.selected && !(values.bracer.color && values.bracer.color.trim().length > 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Podaj kolor karwasza",
        path: ["bracer", "color"]
      });
    }

    if (values.bracer.color && values.bracer.color.trim().length > 120) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Kolor może mieć maksymalnie 120 znaków",
        path: ["bracer", "color"]
      });
    }

    if (values.discountCode && values.discountCode.trim().length > 80) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Hasło rabatowe może mieć maksymalnie 80 znaków",
        path: ["discountCode"]
      });
    }

    if (values.notes && values.notes.trim().length > 1000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Uwagi mogą mieć maksymalnie 1000 znaków",
        path: ["notes"]
      });
    }
  });

export type OrderFormValues = z.infer<typeof orderFormSchema>;
export type OrderFormInput = z.input<typeof orderFormSchema>;

export const ORDER_COLORS_BY_ID = Object.fromEntries(
  ORDER_COLORS.map((color) => [color.id, color.label])
) as Record<(typeof ORDER_COLORS)[number]["id"], string>;

export const ORDER_SIZES_BY_ID = Object.fromEntries(
  ORDER_SIZES.map((size) => [size.id, size.label])
) as Record<(typeof ORDER_SIZES)[number]["id"], string>;

export const MODEL_IDS = ORDER_MODELS.map((model) => model.id);
