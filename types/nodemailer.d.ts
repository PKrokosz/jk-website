declare module "nodemailer" {
  export interface SendMailOptions {
    from: string;
    to: string;
    replyTo?: string;
    subject: string;
    text: string;
  }

  export interface Transporter {
    sendMail: (mail: SendMailOptions) => Promise<unknown>;
  }

  export interface CreateTransportOptions {
    host: string;
    port: number;
    secure?: boolean;
    auth?: {
      user: string;
      pass: string;
    };
  }

  export function createTransport(options: CreateTransportOptions): Transporter;

  const nodemailer: {
    createTransport: typeof createTransport;
  };

  export default nodemailer;
}
