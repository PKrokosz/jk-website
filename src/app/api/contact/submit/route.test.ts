import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const reportServerError = vi.fn();

vi.mock("@/lib/telemetry", () => ({
  reportServerError
}));

const sendMailMock = vi.fn();
const nodemailerMock = vi.hoisted(() => {
  const sendMail = vi.fn();

  return {
    sendMail,
    createTransport: vi.fn(() => ({
      sendMail
    }))
  };
});

vi.mock("nodemailer", () => ({
  __esModule: true,
  default: {
    createTransport: nodemailerMock.createTransport
  }
}));

const { POST } = await import("./route");

function makeRequest(body: unknown, options?: { origin?: string; ip?: string }) {
  const origin = options?.origin ?? "https://jkhandmade.pl";
  const ip = options?.ip ?? "203.0.113.1";

  return new NextRequest("https://jkhandmade.pl/api/contact/submit", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin,
      "x-forwarded-for": ip
    },
    body: JSON.stringify(body)
  });
}

describe("POST /api/contact/submit", () => {
  beforeEach(() => {
    process.env.APP_BASE_URL = "https://jkhandmade.pl";
    process.env.SMTP_HOST = "smtp.example.com";
    process.env.SMTP_PORT = "587";
    process.env.SMTP_USER = "user";
    process.env.SMTP_PASS = "pass";
    process.env.MAIL_FROM = "JK Handmade Footwear <jkhandmade@example.com>";
    process.env.MAIL_TO = "kontakt@jkhandmade.pl";
    nodemailerMock.sendMail.mockResolvedValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
    nodemailerMock.sendMail.mockReset();
  });

  it("rejects invalid payloads", async () => {
    const response = await POST(
      makeRequest({ name: "J", email: "invalid", message: "hi" })
    );

    expect(response.status).toBe(422);
  });

  it("accepts valid payloads", async () => {
    const response = await POST(
      makeRequest({
        name: "Jan Kowalski",
        email: "jan@example.com",
        message: "Chcę zamówić buty szyte metodą Goodyear.",
        phone: "",
        product: "Derby"
      })
    );

    expect(response.status).toBe(200);
    expect(nodemailerMock.sendMail).toHaveBeenCalledOnce();
  });

  it("zwraca błąd przy braku konfiguracji SMTP", async () => {
    delete process.env.SMTP_HOST;

    const response = await POST(
      makeRequest({
        name: "Jan Kowalski",
        email: "jan@example.com",
        message: "Chcę zamówić buty szyte metodą Goodyear.",
        phone: "",
        product: "Derby"
      })
    );

    expect(response.status).toBe(502);
    expect(reportServerError).toHaveBeenCalledWith(
      "contact-mail:transport",
      expect.any(Error)
    );
  });

  it("zwraca błąd przy problemie transportu poczty", async () => {
    const smtpError = new Error("SMTP unavailable");
    sendMailMock.mockRejectedValueOnce(smtpError);

    const response = await POST(
      makeRequest({
        name: "Jan Kowalski",
        email: "jan@example.com",
        message: "Chcę zamówić buty szyte metodą Goodyear.",
        phone: "",
        product: "Derby"
      })
    );

    expect(response.status).toBe(502);
    expect(reportServerError).toHaveBeenCalledWith(
      "contact-mail:transport",
      smtpError
    );
  });
});
