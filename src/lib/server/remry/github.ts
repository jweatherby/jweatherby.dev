// Asks the Remry repo to revoke a license: a `repository_dispatch` that runs its revoke.yml,
// which adds the id to src/shared/license/revoked.ts and opens a PR. The repo is public, so
// only the license id, its expiry and the reason go there: never a name, email or key.

import type { DispatchRevocation } from "./revoke.js";

export const REMRY_REPO = "remry-ai/remry";
export const REVOKE_EVENT = "remry-revoke";

export interface GithubDispatcherDeps {
  /** A fine-grained token for the Remry repo with Contents: read and write. */
  readonly token: string | undefined;
  readonly fetch: typeof fetch;
  readonly repo?: string;
}

export const githubDispatcher =
  (deps: GithubDispatcherDeps): DispatchRevocation =>
  async (revocation) => {
    // Checked here, not at startup, so a missing token only fails refunds, never sales.
    if (!deps.token) throw new Error("GITHUB_DISPATCH_TOKEN is not set");
    const response = await deps.fetch(
      `https://api.github.com/repos/${deps.repo ?? REMRY_REPO}/dispatches`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${deps.token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "jweatherby.dev",
        },
        body: JSON.stringify({
          event_type: REVOKE_EVENT,
          client_payload: {
            id: revocation.id,
            expires: revocation.expires,
            reason: revocation.reason,
          },
        }),
      },
    );
    if (!response.ok) {
      throw new Error(`GitHub dispatch failed: ${response.status}`);
    }
  };
