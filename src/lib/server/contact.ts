// POST /api/contact: the contact form's message, checked and turned into an email to Jamie.
// It's sent from Jamie's own address (Fastmail only sends from your identities), with the
// visitor's address as Reply-To so replying goes straight back to them.

import type { OutgoingEmail } from "./email/jmap.js";

export const CONTACT_INBOX = "jamie@jweatherby.dev";

export interface ContactError {
  readonly message: string;
  readonly code: "VALIDATION_ERROR" | "INTERNAL_ERROR";
}

export type ContactResult =
  | { readonly ok: true; readonly email: OutgoingEmail }
  | { readonly ok: false; readonly errors: readonly ContactError[] };

const REQUIRED = ["from", "subject", "topic", "message"] as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const field = (payload: Record<string, unknown>, name: string): string => {
  const value = payload[name];
  return typeof value === "string" ? value.trim() : "";
};

const invalid = (message: string): ContactResult => ({
  ok: false,
  errors: [{ message, code: "VALIDATION_ERROR" }],
});

export const contactEmail = (payload: unknown): ContactResult => {
  const body =
    typeof payload === "object" && payload !== null
      ? (payload as Record<string, unknown>)
      : {};
  const missing = REQUIRED.filter((name) => !field(body, name));
  if (missing.length > 0) {
    return invalid(`Missing required fields: ${missing.join(", ")}`);
  }

  const from = field(body, "from");
  if (!EMAIL.test(from)) return invalid("Please enter a valid email address");

  const message = field(body, "message");
  if (message.split(/\s+/).length < 5) {
    return invalid("Message must contain at least 5 words");
  }

  return {
    ok: true,
    email: {
      from: { name: "jweatherby.dev contact form", email: CONTACT_INBOX },
      to: CONTACT_INBOX,
      replyTo: from,
      subject: `${field(body, "topic").toUpperCase()} - ${field(body, "subject")}`,
      text: `From: ${from}\n\n${message}`,
    },
  };
};
