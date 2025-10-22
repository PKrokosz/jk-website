import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendMailMock = vi.fn();

vi.mock("nodemailer", () => ({
  __esModule: true,
  default: {
    createTransport: vi.fn(() => ({
      sendMail: sendMailMock
    }))
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
    sendMailMock.mockResolvedValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
    sendMailMock.mockReset();
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
    expect(sendMailMock).toHaveBeenCalledOnce();
  });
});
