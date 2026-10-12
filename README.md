# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Remry Pro licensing

This site sells nothing itself. It issues license keys for [Remry](https://github.com/remry-ai/remry) Pro, which is bought through a Stripe Payment Link (Stripe Managed Payments is the merchant of record). Stripe is the only record: there's no database. The Remry app never contacts this site; it checks keys offline.

- `api/remry/stripe.ts`, `POST /api/remry/stripe`: the Stripe webhook. On `invoice.paid` (the first payment and every renewal), it does the following:

  1. Signs a key: id `stripe-<subscription id>`, the same on every renewal; `expires` the last UTC day of the paid period; `issued` the day the invoice was paid.
  2. Emails the key through Fastmail, like the contact form.
  3. Writes `remry_license_id` and `remry_expires` to the subscription's metadata, so the subscription always shows its license and latest expiry. An older invoice arriving late never moves the expiry back.
  4. Writes the same two fields to the invoice's metadata. An invoice that already has them is skipped, so a redelivered event sends nothing twice.

  A subscription marked `remry_revoked` gets no more keys, here or on the thanks page.

  On a full refund (`charge.refunded`) or a lost dispute (`charge.dispute.closed` with status `lost`), it revokes the license:

  1. Finds the invoice the payment paid. If no key was issued for it, there's nothing to do.
  2. Sends a `repository_dispatch` (`remry-revoke`) to `remry-ai/remry` with the license id, its latest expiry and the reason. The Remry repo's `revoke.yml` runs `license:revoke` and opens a PR. That repo is public: only the id, expiry and reason go there, never a name, email or key.
  3. Writes `remry_revoked: <date> <reason>` to the subscription. A subscription already marked is skipped, so a redelivered event dispatches nothing twice.

  A partial refund or a won dispute keeps the license. Any other event gets a 200 and is ignored. A failure returns a 500, so Stripe retries.

- `api/remry/license.ts`, `GET /api/remry/license?session_id=…`: the key for a finished checkout, built from the subscription's latest paid invoice exactly as the webhook builds it. It's the same key as the one emailed.
- `src/routes/remry/thanks/+page.svelte`, `/remry/thanks?session_id=…`: where the Payment Link sends buyers. It shows the key, says how to activate it, and falls back to "check your email".
- The logic and tests are in `src/lib/server/remry/`.
  - `license.ts` ports `signLicenseKey` from the app (`scripts/license/sign.ts`, the source of truth).
  - `tests/license.test.ts` checks this site's keys with a copy of the app's `readLicensePayload` and its test-only keypair.

Both functions are plain Vercel Node functions, like `api/contact.mjs`. The site itself stays prerendered (`adapter-static`).

### Vercel environment variables

Set these for Production (and Preview, with test-mode values, to try it there). Never commit them.

| Variable                    | Value                                                                                                                                                                                         |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `REMRY_LICENSE_PRIVATE_KEY` | The license signing key, a PKCS8 PEM. Paste it **base64-encoded** (`base64 -i ~/.remry-license/private.pem \| pbcopy`). PEM text with its newlines escaped as `\n` also works.                |
| `STRIPE_SECRET_KEY`         | `sk_live_…` (or `sk_test_…`). A restricted key needs write access to Invoices and Subscriptions, and read access to Customers, Checkout Sessions, Charges and Disputes.                       |
| `STRIPE_WEBHOOK_SECRET`     | The `whsec_…` signing secret of the webhook endpoint below.                                                                                                                                   |
| `FASTMAIL_PASSWORD`         | Already set for the contact form. Keys are sent from `jamie@jweatherby.dev`.                                                                                                                  |
| `GITHUB_DISPATCH_TOKEN`     | A fine-grained GitHub token for `remry-ai/remry` only, with **Contents: read and write** (what `repository_dispatch` needs). Without it, sales still work; refunds return 500 until it's set. |
| `REMRY_STRIPE_PRODUCT_ID`   | Optional: `prod_…` of Remry Pro. Only its invoices issue keys. Set it if the Stripe account sells anything else.                                                                              |

### Stripe setup

1. **Managed Payments:** turn it on under Dashboard → Settings → Managed Payments.
2. **Product:** create "Remry Pro" with a recurring **yearly** price. Give it an eligible tax code, e.g. `txcd_10103000` (SaaS, personal use). Managed Payments needs one.
3. **Payment Link:** create one for that price.
   - Tick **Enable Managed Payments**. It can't be switched on later, only on a new link.
   - Don't set automatic tax, tax ID collection, payment method types or custom text. Managed Payments refuses them.
   - Under **After payment**, choose "Don't show confirmation page" and redirect to:
     `https://jweatherby.dev/remry/thanks?session_id={CHECKOUT_SESSION_ID}`
4. **Webhook:** Developers → Webhooks → Add endpoint:
   - URL: `https://jweatherby.dev/api/remry/stripe`
   - Events: `invoice.paid`, `charge.refunded` and `charge.dispute.closed`.
   - API version: the one the installed `stripe` package pins (`node_modules/stripe/esm/apiVersion.d.ts`). The handler fetches the invoice again anyway, so the event body's version matters little.
   - Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.
5. Put the Payment Link URL in the Remry repo: `REMRY_LINKS.buy` in `src/shared/types/site.ts`, and the README's buy button.

### Test-mode end-to-end checklist

Use a Stripe sandbox (test keys) and a Preview deployment with test-mode variables. To try it locally, use the Stripe CLI: `stripe listen --forward-to <preview url>/api/remry/stripe`.

1. **Buy** from the test Payment Link (card `4242 4242 4242 4242`).
2. **Thanks page:** it shows the key, good through a year from today, and the masked email.
3. **Email:** the same key arrives. In Stripe, the invoice's metadata has `remry_license_id` and `remry_expires`.
4. **Redelivery:** resend the `invoice.paid` event from the Dashboard. No second email: the delivery log shows the response `{"ok":true,"alreadyIssued":true}`.
5. **Activate:** in the Remry app, run with `APP_ENV` unset and the real public key. This needs the keypair from "Before going live" below. Paste the key on the License page, or ask Claude to run `license.activate`.
6. **Renewal:** open the subscription → **Run simulation** → advance the clock past the renewal date. A new `invoice.paid` arrives, and a new key is emailed with the **same id** and an expiry a year later. Managed Payments subscriptions can only come from Checkout or Payment Links, so simulate on the Payment Link subscription. If simulation isn't offered there, check the renewal in live mode on the first real renewal instead.
7. **Refund:** refund the whole payment and cancel the subscription in Stripe.
   - The subscription gets `remry_revoked: <date> refund`.
   - In `remry-ai/remry`, the "Revoke a license" workflow runs and opens a PR adding the id to `revoked.ts`. Merge it and release; the key stops working once the app updates.
   - Resend the `charge.refunded` event: the response is `{"ok":true,"alreadyRevoked":…}` and no second run starts.
   - A sandbox's dispatch goes to the real repo. Close that PR instead of merging it.

**Check during the first test run:**

- The docs don't say whether Managed Payments allows writing invoice or subscription metadata. If step 3's metadata writes fail, the webhook keeps returning 500. Without subscription metadata, revocation needs another home, too.
- Managed Payments makes Stripe the merchant of record and handles disputes. Check whether `charge.refunded` and `charge.dispute.closed` still reach this endpoint, and whether `invoicePayments.list` finds the invoice from the refunded charge's PaymentIntent. If refunds don't arrive, revoke by hand as before: `bun run license:revoke --id stripe-<subscription id> --expires <remry_expires> --reason refund` in the Remry repo.

### Before going live

On the Mac, in the Remry repo:

1. Run `bun run license:keygen`. It writes `~/.remry-license/private.pem` and rewrites `src/shared/license/public-key.ts`. The key from an earlier session was lost, so the committed public key has to be replaced.
2. Back up `private.pem` off the Mac, for example in a password manager. Anyone with it can issue keys; lose it, and every key sold needs reissuing.
3. Commit the new `public-key.ts` and release the app.
4. Put the private key into Vercel's `REMRY_LICENSE_PRIVATE_KEY` (base64, as above).
5. Reissue your own key with `bun run license:issue`.
