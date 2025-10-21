import { ORDER_ACCESSORY_MAP } from "@/config/orderAccessories";
import { GOOGLE_FORM_CONSTANTS, ORDER_FORM_ENTRIES } from "@/config/orderFormEntries";
import { ORDER_MODEL_MAP } from "@/config/orderModels";

import { ORDER_COLORS_BY_ID, ORDER_SIZES_BY_ID, type OrderFormValues } from "./schema";

const OTHER_OPTION_VALUE = "__other_option__";

type MeasurementValue =
  | OrderFormValues["footLength"]
  | OrderFormValues["instepCircumference"]
  | OrderFormValues["calfCircumference"];

const formatMeasurement = (value: MeasurementValue) =>
  typeof value === "number" && Number.isFinite(value) ? value.toString().replace(".", ",") : "";

export function buildGoogleFormPayload(values: OrderFormValues) {
  const params = new URLSearchParams();

  params.append(ORDER_FORM_ENTRIES.fullName, values.fullName.trim());
  params.append(ORDER_FORM_ENTRIES.phoneNumber, values.phoneNumber.trim());
  params.append(ORDER_FORM_ENTRIES.parcelLockerCode, values.parcelLockerCode.trim());
  params.append(ORDER_FORM_ENTRIES.email, values.email.trim());
  params.append(ORDER_FORM_ENTRIES.footLength, formatMeasurement(values.footLength));
  params.append(
    ORDER_FORM_ENTRIES.instepCircumference,
    formatMeasurement(values.instepCircumference)
  );

  if (typeof values.calfCircumference === "number") {
    params.append(
      ORDER_FORM_ENTRIES.calfCircumference,
      formatMeasurement(values.calfCircumference)
    );
  }

  const model = ORDER_MODEL_MAP[values.modelId];
  if (model) {
    params.append(ORDER_FORM_ENTRIES.model, model.googleValue);
  }

  const color = ORDER_COLORS_BY_ID[values.color as keyof typeof ORDER_COLORS_BY_ID];
  if (color) {
    params.append(ORDER_FORM_ENTRIES.color, color);
  }

  const sizeLabel = ORDER_SIZES_BY_ID[values.size as keyof typeof ORDER_SIZES_BY_ID];
  params.append(ORDER_FORM_ENTRIES.size, values.size);
  if (sizeLabel) {
    params.append(`${ORDER_FORM_ENTRIES.size}_label`, sizeLabel);
  }

  values.accessories.forEach((accessoryId: OrderFormValues["accessories"][number]) => {
    const accessory = ORDER_ACCESSORY_MAP[accessoryId];
    if (accessory) {
      params.append(ORDER_FORM_ENTRIES.accessories, accessory.googleValue);
    }
  });

  if (values.waterskin.selected) {
    params.append(ORDER_FORM_ENTRIES.waterskin, "Bukłak - 250 zł");
  }

  const waterskinSymbol = values.waterskin.symbol?.trim();
  if (waterskinSymbol) {
    params.append(ORDER_FORM_ENTRIES.waterskin, OTHER_OPTION_VALUE);
    params.append(`${ORDER_FORM_ENTRIES.waterskin}.other_option_response`, waterskinSymbol);
  }

  if (values.bracer.selected) {
    params.append(ORDER_FORM_ENTRIES.bracer, "Dodaj karwasz - 280 zł");
  }

  const bracerColor = values.bracer.color?.trim();
  if (bracerColor) {
    params.append(ORDER_FORM_ENTRIES.bracer, OTHER_OPTION_VALUE);
    params.append(`${ORDER_FORM_ENTRIES.bracer}.other_option_response`, bracerColor);
  }

  if (values.shoeTrees) {
    params.append(ORDER_FORM_ENTRIES.shoeTrees, "Dokup prawidła sosnowe do swoich butów - 150 zł");
  }

  if (values.discountCode && values.discountCode.trim().length > 0) {
    params.append(ORDER_FORM_ENTRIES.discountCode, values.discountCode.trim());
  }

  if (values.notes && values.notes.trim().length > 0) {
    params.append(ORDER_FORM_ENTRIES.notes, values.notes.trim());
  }

  params.append("fvv", GOOGLE_FORM_CONSTANTS.fvv);
  params.append("pageHistory", GOOGLE_FORM_CONSTANTS.pageHistory);
  params.append("fbzx", GOOGLE_FORM_CONSTANTS.fbzx);

  return params;
}

export async function submitOrderToGoogle(values: OrderFormValues) {
  const body = buildGoogleFormPayload(values);

  const response = await fetch(GOOGLE_FORM_CONSTANTS.actionUrl, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    body: body.toString(),
    redirect: "manual"
  });

  return response;
}
