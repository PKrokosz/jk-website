import { NextResponse } from "next/server";

import { submitOrderToGoogle } from "@/lib/order/googleForm";
import { orderFormSchema } from "@/lib/order/schema";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ message: "Nieprawidłowy format danych" }, { status: 400 });
  }

  const result = orderFormSchema.safeParse(payload);

  if (!result.success) {
    return NextResponse.json({
      message: "Walidacja nie powiodła się",
      errors: result.error.flatten().fieldErrors
    }, { status: 422 });
  }

  try {
    const response = await submitOrderToGoogle(result.data);

    if (response.status >= 200 && response.status < 400) {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ message: "Nie udało się zapisać formularza" }, { status: 502 });
  } catch (error) {
    return NextResponse.json({ message: "Wystąpił błąd serwera" }, { status: 500 });
  }
}
