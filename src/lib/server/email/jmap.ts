// Sends mail through Fastmail's JMAP API over HTTPS. Cloudflare Workers can't hold an SMTP
// connection reliably, so this replaces nodemailer. It drafts the message in Drafts, submits
// it, and on success moves it to Sent, which is what Fastmail's own clients do.
//
// Needs a Fastmail API token (Settings → Privacy & Security → API tokens) with Email
// submission access, and a Fastmail identity for the sender address.

export interface Address {
  readonly name?: string;
  readonly email: string;
}

export interface OutgoingEmail {
  readonly from: Address;
  readonly to: string;
  readonly replyTo?: string;
  readonly subject: string;
  readonly text: string;
}

export type SendEmail = (email: OutgoingEmail) => Promise<void>;

export interface JmapSenderDeps {
  readonly token: string;
  readonly fetch: typeof fetch;
  readonly sessionUrl?: string;
}

export const FASTMAIL_SESSION_URL = "https://api.fastmail.com/jmap/session";

const USING = [
  "urn:ietf:params:jmap:core",
  "urn:ietf:params:jmap:mail",
  "urn:ietf:params:jmap:submission",
] as const;

type MethodCall = readonly [string, Readonly<Record<string, unknown>>, string];
type MethodResponse = readonly [string, Record<string, unknown>, string];

interface JmapSession {
  readonly apiUrl: string;
  readonly primaryAccounts: Readonly<Record<string, string>>;
}

interface Identity {
  readonly id: string;
  readonly email: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isSession = (value: unknown): value is JmapSession =>
  isRecord(value) &&
  typeof value.apiUrl === "string" &&
  isRecord(value.primaryAccounts);

/** The response to the call tagged `tag`; throws on a JMAP error response or a missing one. */
const responseFor = (
  responses: readonly MethodResponse[],
  tag: string,
): Record<string, unknown> => {
  const found = responses.find(([, , t]) => t === tag);
  if (!found) throw new Error(`JMAP: no response for ${tag}`);
  const [name, args] = found;
  if (name === "error") {
    throw new Error(`JMAP: ${tag} failed: ${String(args.type)}`);
  }
  return args;
};

const firstId = (args: Record<string, unknown>, what: string): string => {
  const ids = args.ids;
  if (!Array.isArray(ids) || typeof ids[0] !== "string") {
    throw new Error(`JMAP: no ${what} mailbox`);
  }
  return ids[0];
};

/** Throws when a `/set` response left anything in `notCreated`. */
const assertCreated = (args: Record<string, unknown>, what: string): void => {
  const notCreated = args.notCreated;
  if (isRecord(notCreated) && Object.keys(notCreated).length > 0) {
    const first = Object.values(notCreated)[0];
    const type = isRecord(first) ? String(first.type) : "unknown";
    throw new Error(`JMAP: ${what} not created: ${type}`);
  }
};

export const jmapSender = (deps: JmapSenderDeps): SendEmail => {
  // Called unbound: Workers throw "Illegal invocation" for deps.fetch(...).
  const send = deps.fetch;
  const headers = {
    Authorization: `Bearer ${deps.token}`,
    "Content-Type": "application/json",
  };

  const session = async (): Promise<{ apiUrl: string; accountId: string }> => {
    const res = await send(deps.sessionUrl ?? FASTMAIL_SESSION_URL, {
      headers,
    });
    if (!res.ok) throw new Error(`JMAP session failed: ${res.status}`);
    const body: unknown = await res.json();
    if (!isSession(body)) throw new Error("JMAP session: unexpected response");
    const accountId = body.primaryAccounts["urn:ietf:params:jmap:mail"];
    if (!accountId) throw new Error("JMAP session: no mail account");
    return { apiUrl: body.apiUrl, accountId };
  };

  const call = async (
    apiUrl: string,
    methodCalls: readonly MethodCall[],
  ): Promise<readonly MethodResponse[]> => {
    const res = await send(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ using: USING, methodCalls }),
    });
    if (!res.ok) throw new Error(`JMAP request failed: ${res.status}`);
    const body: unknown = await res.json();
    if (!isRecord(body) || !Array.isArray(body.methodResponses)) {
      throw new Error("JMAP: unexpected response");
    }
    return body.methodResponses as readonly MethodResponse[];
  };

  return async (email) => {
    const { apiUrl, accountId } = await session();

    const lookup = await call(apiUrl, [
      ["Identity/get", { accountId }, "identities"],
      ["Mailbox/query", { accountId, filter: { role: "drafts" } }, "drafts"],
      ["Mailbox/query", { accountId, filter: { role: "sent" } }, "sent"],
    ]);
    const identities = (responseFor(lookup, "identities").list ??
      []) as readonly Identity[];
    const sender = email.from.email.toLowerCase();
    const identity = identities.find((i) => i.email.toLowerCase() === sender);
    if (!identity) throw new Error(`JMAP: no identity for ${email.from.email}`);
    const draftsId = firstId(responseFor(lookup, "drafts"), "drafts");
    const sentId = firstId(responseFor(lookup, "sent"), "sent");

    const sent = await call(apiUrl, [
      [
        "Email/set",
        {
          accountId,
          create: {
            draft: {
              mailboxIds: { [draftsId]: true },
              keywords: { $draft: true, $seen: true },
              from: [email.from],
              to: [{ email: email.to }],
              ...(email.replyTo ? { replyTo: [{ email: email.replyTo }] } : {}),
              subject: email.subject,
              bodyValues: { body: { value: email.text } },
              textBody: [{ partId: "body", type: "text/plain" }],
            },
          },
        },
        "email",
      ],
      [
        "EmailSubmission/set",
        {
          accountId,
          create: { send: { identityId: identity.id, emailId: "#draft" } },
          onSuccessUpdateEmail: {
            "#send": {
              [`mailboxIds/${draftsId}`]: null,
              [`mailboxIds/${sentId}`]: true,
              "keywords/$draft": null,
            },
          },
        },
        "submission",
      ],
    ]);
    assertCreated(responseFor(sent, "email"), "email");
    assertCreated(responseFor(sent, "submission"), "submission");
  };
};
