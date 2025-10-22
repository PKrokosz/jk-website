import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z
    .string()
    .max(40)
    .optional()
    .or(z.literal("")),
  message: z.string().min(10).max(5000),
  product: z.string().max(120).optional(),
  website: z.string().max(0).optional()
});

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;
const buckets = new Map<string, { count: number; ts: number }>();

function isRateLimited(key: string) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.ts > RATE_WINDOW_MS) {
    buckets.set(key, { count: 1, ts: now });
    return false;
  }

  const count = bucket.count + 1;
  bucket.count = count;
  bucket.ts = now;

  return count > RATE_MAX;
}

function isOriginAllowed(origin: string | null, referer: string | null) {
  const allowed = process.env.APP_BASE_URL;

  if (!allowed) {
    return true;
  }

  if (!origin && !referer) {
    return true;
  }

  const check = (value: string | null) => (value ? value.startsWith(allowed) : false);

  return check(origin) || check(referer);
}

function getMailer() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    throw new Error("Missing SMTP configuration");
  }

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: false,
    auth: { user, pass }
  });
}

export async function POST(req: NextRequest) {
  if (!isOriginAllowed(req.headers.get("origin"), req.headers.get("referer"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "0.0.0.0";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
  }

  let payload: unknown;

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation error", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const { name, email, phone, message, product } = parsed.data;

  const mailSubject = `Nowe zapytanie z formularza – ${name}${product ? ` / ${product}` : ""}`;
  const mailText = [
    `Imię i nazwisko: ${name}`,
    `E-mail: ${email}`,
    `Telefon: ${phone || "-"}`,
    product ? `Produkt: ${product}` : null,
    "",
    "Wiadomość:",
    message
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const from = process.env.MAIL_FROM;
    const to = process.env.MAIL_TO;

    if (!from || !to) {
      throw new Error("Missing mail recipients");
    }

    const transporter = getMailer();

    await transporter.sendMail({
      from,
      to,
      replyTo: email,
      subject: mailSubject,
      text: mailText
    });
  } catch (error) {
    console.error("Mail error:", error);
    return NextResponse.json({ error: "Mail service unavailable" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
