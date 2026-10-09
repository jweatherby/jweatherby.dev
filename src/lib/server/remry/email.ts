// The email that carries a Remry Pro key, sent the way the contact form sends mail: Fastmail SMTP.

import nodemailer from "nodemailer";
import type { LicensePayload } from "./license.js";

export interface LicenseEmail {
  readonly to: string;
  readonly subject: string;
  readonly text: string;
}

export type SendLicenseEmail = (email: LicenseEmail) => Promise<void>;

const SENDER = "jamie@jweatherby.dev";

export const licenseEmail = (
  payload: LicensePayload,
  key: string,
): LicenseEmail => ({
  to: payload.email,
  subject: "Your Remry Pro license key",
  text: [
    `Hi ${payload.name},`,
    "",
    `Thanks for buying Remry Pro. Here's your license key, good through ${payload.expires}:`,
    "",
    key,
    "",
    "To activate it, open Remry, choose License from the notebook menu (the chevron beside",
    "the notebook name) and paste the key. Or ask Claude to run license.activate with it.",
    "",
    "When your subscription renews, a new key arrives by email. Keep this one until then.",
    "",
    "Install help: https://github.com/remry-ai/remry",
    `Questions, or lost your key? Reply to this email.`,
    "",
    "Jamie",
  ].join("\n"),
});

export const fastmailSender = (password: string): SendLicenseEmail => {
  const transporter = nodemailer.createTransport({
    host: "smtp.fastmail.com",
    port: 465,
    secure: true,
    auth: { user: SENDER, pass: password },
  });
  return async (email) => {
    await transporter.sendMail({
      from: `Remry <${SENDER}>`,
      to: email.to,
      subject: email.subject,
      text: email.text,
    });
  };
};
