declare module "nodemailer" {
  export interface SendMailOptions {
    from: string;
    to: string;
    replyTo?: string;
    subject: string;
    text: string;
  }

  export interface Transporter {
    sendMail(mail: SendMailOptions): Promise<unknown>;
  }

  export interface TransportOptions {
    host: string;
    port: number;
    secure?: boolean;
    auth: {
      user: string;
      pass: string;
    };
  }

  export function createTransport(options: TransportOptions): Transporter;

  const nodemailer: {
    createTransport: typeof createTransport;
  };

  export default nodemailer;
}

declare module "@playwright/test" {
  export type Page = any;

  export interface TestContext {
    page: Page;
  }

  export type TestCallback = (context: TestContext) => Promise<void> | void;

  export interface TestAPI {
    (name: string, fn: TestCallback): void;
    describe: (name: string, fn: () => void) => void;
  }

  export const test: TestAPI;
  export const expect: (...args: any[]) => any;
}
