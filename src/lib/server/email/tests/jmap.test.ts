import { describe, expect, it } from "vitest";
import { jmapSender } from "../jmap.js";

interface Request {
  readonly url: string;
  readonly body: { readonly methodCalls: readonly unknown[][] } | null;
}

const SESSION = {
  apiUrl: "https://api.example/jmap/api/",
  primaryAccounts: { "urn:ietf:params:jmap:mail": "acc1" },
};

const LOOKUP = {
  methodResponses: [
    ["Identity/get", { list: [{ id: "id1", email: "Jamie@jweatherby.dev" }] }, "identities"],
    ["Mailbox/query", { ids: ["drafts1"] }, "drafts"],
    ["Mailbox/query", { ids: ["sent1"] }, "sent"],
  ],
};

const SENT = {
  methodResponses: [
    ["Email/set", { created: { draft: { id: "e1" } } }, "email"],
    ["EmailSubmission/set", { created: { send: { id: "s1" } } }, "submission"],
  ],
};

const fakeFetch = (responses: readonly unknown[]) => {
  const requests: Request[] = [];
  let i = 0;
  const fetch = (async (url: string, init?: RequestInit) => {
    requests.push({ url, body: init?.body ? JSON.parse(String(init.body)) : null });
    return Response.json(responses[i++]);
  }) as typeof globalThis.fetch;
  return { fetch, requests };
};

const email = {
  from: { name: "Remry", email: "jamie@jweatherby.dev" },
  to: "dana@example.com",
  replyTo: "reply@example.com",
  subject: "Hi",
  text: "Hello there",
};

describe("jmapSender", () => {
  it("drafts the email, submits it with the sender's identity and files it in Sent", async () => {
    const { fetch, requests } = fakeFetch([SESSION, LOOKUP, SENT]);
    await jmapSender({ token: "t", fetch })(email);

    expect(requests.map((r) => r.url)).toEqual([
      "https://api.fastmail.com/jmap/session",
      SESSION.apiUrl,
      SESSION.apiUrl,
    ]);
    const [[, create], [, submission]] = requests[2]!.body!.methodCalls as [
      [string, { create: { draft: Record<string, unknown> } }],
      [string, Record<string, unknown>],
    ];
    expect(create.create.draft).toMatchObject({
      mailboxIds: { drafts1: true },
      from: [email.from],
      to: [{ email: "dana@example.com" }],
      replyTo: [{ email: "reply@example.com" }],
      subject: "Hi",
      bodyValues: { body: { value: "Hello there" } },
    });
    expect(submission).toMatchObject({
      accountId: "acc1",
      create: { send: { identityId: "id1", emailId: "#draft" } },
      onSuccessUpdateEmail: {
        "#send": { "mailboxIds/drafts1": null, "mailboxIds/sent1": true },
      },
    });
  });

  it("fails when there's no identity for the sender", async () => {
    const { fetch } = fakeFetch([SESSION, LOOKUP]);
    await expect(
      jmapSender({ token: "t", fetch })({ ...email, from: { email: "x@example.com" } }),
    ).rejects.toThrow("no identity");
  });

  it("fails when Fastmail refuses the submission", async () => {
    const refused = {
      methodResponses: [
        SENT.methodResponses[0],
        ["EmailSubmission/set", { notCreated: { send: { type: "forbiddenFrom" } } }, "submission"],
      ],
    };
    const { fetch } = fakeFetch([SESSION, LOOKUP, refused]);
    await expect(jmapSender({ token: "t", fetch })(email)).rejects.toThrow("forbiddenFrom");
  });
});
