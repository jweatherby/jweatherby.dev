import { describe, expect, it } from "vitest";
import { contactEmail } from "../contact.js";

const valid = {
  from: "visitor@example.com",
  subject: "Hello",
  topic: "connect",
  message: "I would like to say hello",
};

describe("contactEmail", () => {
  it("sends from Jamie's address with the visitor as Reply-To", () => {
    const result = contactEmail(valid);
    expect(result).toEqual({
      ok: true,
      email: {
        from: { name: "jweatherby.dev contact form", email: "jamie@jweatherby.dev" },
        to: "jamie@jweatherby.dev",
        replyTo: "visitor@example.com",
        subject: "CONNECT - Hello",
        text: "From: visitor@example.com\n\nI would like to say hello",
      },
    });
  });

  it("names missing fields", () => {
    expect(contactEmail({ from: "a@b.co" })).toMatchObject({
      ok: false,
      errors: [{ message: "Missing required fields: subject, topic, message" }],
    });
    expect(contactEmail(null)).toMatchObject({ ok: false });
  });

  it("refuses a bad address or a short message", () => {
    expect(contactEmail({ ...valid, from: "nope" })).toMatchObject({ ok: false });
    expect(contactEmail({ ...valid, message: "too short" })).toMatchObject({
      ok: false,
      errors: [{ message: "Message must contain at least 5 words" }],
    });
  });
});
